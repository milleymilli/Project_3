require("dotenv").config();
const mysql = require("mysql2");

// MySQL Connection Configuration
const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASS,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectTimeout: 10000, // 10 seconds
};

// Create the connection
let db = mysql.createConnection(dbConfig);

function handleDisconnect() {
  db = mysql.createConnection(dbConfig);

  db.connect((err) => {
    if (err) {
      console.error("Error connecting to database:", err);
      // Retry after 2 seconds
      setTimeout(handleDisconnect, 2000);
      return;
    }
    console.log("✅ MySQL Connected...");
  });

  db.on("error", (err) => {
    console.error("Database error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect(); // Reconnect if connection lost
    } else {
      throw err;
    }
  });
}

// Initial connection
handleDisconnect();

// Ping database every 5 minutes to keep connection alive
setInterval(() => {
  if (db.state !== "disconnected") {
    db.query("SELECT 1", (err) => {
      if (err) console.error("Database ping failed:", err);
    });
  }
}, 300000); // 5 minutes

module.exports = db;
