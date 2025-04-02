require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
//app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || undefined,
  database: process.env.DB_NAME || "vkitchen",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("✅ MySQL Connected...");
});

// Routes
app.get("/", (req, res) => res.send("Welcome to Express Server!"));

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.post("/users", (req, res) => {
  const { name, email } = req.body;
  db.query(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [name, email],
    (err, result) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: result.insertId, name, email });
    }
  );
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
