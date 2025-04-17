require("dotenv").config();
const express = require("express");
const db = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Static Files Configuration (non-HTML assets only)
app.use(
  express.static(path.join(__dirname, "public"), {
    index: false, // Disable automatic index.html serving
    extensions: [
      "css",
      "js",
      "png",
      "jpg",
      "jpeg",
      "gif",
      "svg",
      "ico",
      "json",
      "woff",
      "woff2",
      "ttf",
    ],
  })
);

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Route Handlers
// 1. Redirect root to login
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

// // 2. Public login route
// app.get("/login", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "login.html"));
// });

// 3. Protected routes
app.get("/index.html", authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 4. Protected API endpoint
app.get("/api/protected-data", authenticateToken, (req, res) => {
  res.json({ secretData: "This is protected" });
});

// 5. API routes
require("./routes/api")(app, db);

// 6. Catch-all for other HTML files (optional)
app.get("/*.html", (req, res) => {
  res.status(404).send("Page not found");
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server error");
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
