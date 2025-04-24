require("dotenv").config();
const mysql = require("mysql2");

const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASS,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  connectTimeout: 10000, // 10 seconds
  enableKeepAlive: true, // Crucial for preventing ECONNRESET
  keepAliveInitialDelay: 10000, // Start keep-alive after 10 seconds
  ssl: process.env.DB_SSL ? { rejectUnauthorized: false } : null,
};

let db;

// Connection management with retry logic
function connectWithRetry(attempt = 1) {
  db = mysql.createConnection(dbConfig);

  db.connect((err) => {
    if (err) {
      console.error(`Connection attempt ${attempt} failed:`, err.message);

      // Exponential backoff (max ~30 seconds)
      const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
      console.log(`Retrying in ${delay / 1000} seconds...`);

      setTimeout(() => connectWithRetry(attempt + 1), delay);
      return;
    }
    console.log("✅ MySQL Connected");
    setupConnectionHandlers();
  });
}

// Setup event handlers for active connection
function setupConnectionHandlers() {
  // Handle connection errors
  db.on("error", (err) => {
    if (err.code === "PROTOCOL_CONNECTION_LOST" || err.code === "ECONNRESET") {
      console.log("Connection lost. Reconnecting...");
      connectWithRetry();
    } else if (err.fatal) {
      console.error("Fatal database error:", err);
      process.exit(1);
    } else {
      console.error("Non-fatal database error:", err);
    }
  });

  // Keep connection alive
  setInterval(() => {
    if (db.state === "connected") {
      db.query("SELECT 1", (err) => {
        if (err) console.error("Keep-alive failed:", err.message);
      });
    }
  }, 30000); // Every 30 seconds
}

// Initialize connection
connectWithRetry();

// Graceful shutdown
process.on("SIGINT", () => {
  if (db) db.end();
  console.log("Database connection closed");
  process.exit();
});

module.exports = db;
