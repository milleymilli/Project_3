require("dotenv").config();
const mysql = require("mysql2");
const retry = require("async-retry"); // Install with: npm install async-retry

const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASS,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectTimeout: 10000,
  ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : null,
};

let db;
let isConnecting = false;
let connectionAttempts = 0;
const MAX_RETRIES = 5;

async function initializeConnection() {
  try {
    await retry(
      async (bail) => {
        if (isConnecting) return;
        isConnecting = true;

        console.log(
          `Attempting database connection (${
            connectionAttempts + 1
          }/${MAX_RETRIES})`
        );

        db = mysql.createConnection(dbConfig);

        await new Promise((resolve, reject) => {
          db.connect((err) => {
            if (err) {
              connectionAttempts++;
              if (connectionAttempts >= MAX_RETRIES) {
                bail(new Error("Max connection attempts reached"));
                return;
              }
              reject(err);
              return;
            }
            connectionAttempts = 0;
            resolve();
          });
        });

        console.log("✅ MySQL Connected...");
        isConnecting = false;
      },
      {
        retries: MAX_RETRIES,
        minTimeout: 2000,
        maxTimeout: 10000,
      }
    );

    setupEventHandlers();
    startKeepAlive();
  } catch (err) {
    console.error("Fatal database connection error:", err);
    process.exit(1);
  }
}

function setupEventHandlers() {
  db.on("error", (err) => {
    console.error("Database error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("Reconnecting to database...");
      initializeConnection();
    } else {
      // For other errors, you might want to handle them differently
      console.error("Unrecoverable database error:", err);
    }
  });
}

function startKeepAlive() {
  // Ping every 5 minutes but with better error handling
  setInterval(async () => {
    try {
      if (db && db.state !== "disconnected") {
        await new Promise((resolve, reject) => {
          db.query("SELECT 1", (err) => {
            if (err) {
              console.error("Keep-alive ping failed:", err);
              reject(err);
              return;
            }
            console.log("Database keep-alive ping successful");
            resolve();
          });
        });
      }
    } catch (err) {
      console.error("Keep-alive failed, attempting reconnect...");
      initializeConnection();
    }
  }, 300000);
}

// Initialize connection
initializeConnection();

// Graceful shutdown
process.on("SIGINT", () => {
  if (db) db.end();
  process.exit();
});

module.exports = db;
