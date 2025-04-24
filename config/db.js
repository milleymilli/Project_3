require("dotenv").config();
const mysql = require("mysql2");

const createConnection = () => {
  const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
  });

  db.connect((err) => {
    if (err) {
      console.error("Database connection failed:", err);
      // Try reconnecting in case of error
      setTimeout(createConnection, 5000);
      return;
    }
    console.log("✅ MySQL Connected...");
  });

  return db;
};

let db = createConnection();

module.exports = db;
