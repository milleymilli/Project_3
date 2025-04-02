require("dotenv").config();
const mysql = require("mysql2/promise"); // Using promise version

async function fixPermissions() {
  // Root connection (you'll need to enter root password once)
  const rootConn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: "root",
    password: process.env.ROOT_PASS || "", // Optional: Add ROOT_PASS to .env
    database: "mysql",
  });

  try {
    // Create/grant user (using .env variables)
    await rootConn.execute(
      `CREATE USER IF NOT EXISTS ?@'localhost' IDENTIFIED BY ?`,
      [process.env.DB_USER, process.env.DB_PASS]
    );

    await rootConn.execute(
      `GRANT ALL PRIVILEGES ON ${process.env.DB_NAME}.* TO ?@'localhost'`,
      [process.env.DB_USER]
    );

    // For MySQL 8+ auth issues:
    await rootConn.execute(
      `ALTER USER ?@'localhost' IDENTIFIED WITH mysql_native_password BY ?`,
      [process.env.DB_USER, process.env.DB_PASS]
    );

    await rootConn.execute("FLUSH PRIVILEGES");
    console.log("✅ Permissions fixed successfully");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await rootConn.end();
  }
}

fixPermissions();
