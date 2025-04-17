require("dotenv").config();
const mysql = require("mysql2");

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || undefined,
  database: process.env.DB_NAME || "vkitchen",
  authPlugins: {
    mysql_clear_password: () => () => Buffer.from(process.env.DB_PASS + "\0"),
  },
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("✅ MySQL Connected...");
});

module.exports = db;
