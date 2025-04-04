require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10; //adding extra layers of security to your password encryption
const salt = bcrypt.genSaltSync(saltRounds);
console.log(salt);

const app = express();
const path = require("path");
//const { error } = require("console");
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: "*", // Or '*' for development
    methods: ["GET", "POST"],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

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
// Routes

app.get("/favicon.ico", (req, res) => {
  res.status(204).end(); // No-content response
});

app.get("/", (req, res) => res.send("Welcome to Express Server!"));

app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.get("/recipes", (req, res) => {
  db.query("SELECT * FROM recipes", (err, results) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(results);
  });
});

app.post("/users", async (req, res) => {
  console.log("Incoming data");

  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    // 1. Check email exists
    const [users] = await db
      .promise()
      .query("SELECT uid FROM users WHERE email = ?", [email.toLowerCase()]);

    if (users.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }
    // Hash password
    const hashPasswords = await bcrypt.hash(password, saltRounds);

    //Insert user
    const [result] = await db
      .promise()
      .query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
        name,
        email.toLowerCase(),
        hashPasswords,
      ]);
    res.status(201).json({
      success: true,
      userId: result.insertId,
    });
  } catch (err) {
    console.error("Registration error:", {
      code: err.code,
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({
      error:
        err.code === "ER_DUP_ENTRY"
          ? "Email already exists"
          : "Registration failed",
    });
  }
});

// GET /recipes/:id

app.get("/recipe/:rid", async (req, res) => {
  try {
    const [recipe] = await db.promise().query(
      `
      SELECT r.*, u.name as author 
      FROM recipes r
      JOIN users u ON r.uid = u.uid
      WHERE rid = ?
    `,
      [req.params.rid]
    );

    // Ensure consistent response structure
    res.json({
      success: true,
      data: {
        ...recipe,
      },
    });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({
      success: false,
      error: "Database error",
      data: null,
    });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
