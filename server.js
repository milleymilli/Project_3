require("dotenv").config();
const express = require("express");
const db = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const authenticateToken = require("./routes/auth");
const app = express();
const PORT = process.env.DB_PORT || 3000;
// const corsOptions = {
//   origin: "http://localhost:5000", // Use your actual frontend URLs
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true, // This allows credentials to be sent with requests
// };
//app.use(cors(corsOptions));

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

// Route Handlers
// 1. Redirect root to login
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

// 3. PROTECTED ROUTES
app.get("/index.html", authenticateToken, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 4.PROTECTED API END-POINTS
app.get("/api/protected-data", authenticateToken, (req, res) => {
  res.json({ secretData: "This is protected" });
});

// 5. API ROUTES
require("./routes/api")(app, db);

app.get("/*.html", (req, res) => {
  res.status(404).send("Page not found");
});

// ERROR HANDLING
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server error");
});
//EXPORTING APP FOR TESTING IF IT'S IN TEST MODE
if (process.env.NODE_ENV === "test") {
  module.exports = app; // Makes the app available for testing
} else {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}
