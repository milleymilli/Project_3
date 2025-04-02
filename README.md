# Project_3

First commit of my branch

1. Environment & Module Setup
   javascript
   Copy

require("dotenv").config(); // Loads environment variables from .env file
const express = require("express"); // Imports Express framework
const mysql = require("mysql2"); // MySQL database driver
const cors = require("cors"); // Enables Cross-Origin Resource Sharing
const bodyParser = require("body-parser"); // Parses HTTP request bodies

2. Server Initialization
   javascript
   Copy

const app = express(); // Creates an Express application
const path = require("path"); // Node.js path module for file/directory paths
const PORT = process.env.PORT || 5000; // Uses PORT from .env or defaults to 5000

3. Middleware Setup
   javascript
   Copy

app.use(express.static(path.join(\_\_dirname, "public"))); // Serves static files from /public
app.use(cors()); // Enables all CORS requests
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded form data
// app.use(express.json()); // (Commented out) Would parse JSON request bodies

4. Database Connection
   javascript
   Copy

const db = mysql.createConnection({
host: process.env.DB_HOST || "localhost", // Database host
user: process.env.DB_USER || "root", // Database username
password: process.env.DB_PASS || undefined, // Database password
database: process.env.DB_NAME || "vkitchen", // Database name
});

db.connect((err) => { // Attempts database connection
if (err) {
console.error("Database connection failed:", err);
return;
}
console.log("✅ MySQL Connected..."); // Success message
});

5. Route Handlers
   javascript
   Copy

// GET / - Returns welcome message
app.get("/", (req, res) => res.send("Welcome to Express Server!"));

// GET /users - Fetches all users from database
app.get("/users", (req, res) => {
db.query("SELECT \* FROM users", (err, results) => {
if (err) res.status(500).json({ error: err.message }); // Error handling
else res.json(results); // Sends query results as JSON
});
});

// POST /users - Creates a new user
app.post("/users", (req, res) => {
const { name, email } = req.body; // Destructures request body
db.query(
"INSERT INTO users (name, email) VALUES (?, ?)", // SQL query
[name, email], // Query parameters
(err, result) => {
if (err) res.status(500).json({ error: err.message });
else res.json({ id: result.insertId, name, email }); // Returns new user data
}
);
});

6. Server Activation
   javascript
   Copy

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)); // Starts the server

Key Flow

    Imports dependencies and configures environment variables

    Initializes Express app and middleware

    Connects to MySQL database

    Defines routes for:

        Root endpoint (/)

        User data retrieval (GET /users)

        User creation (POST /users)

    Starts listening on specified port

Critical Notes

    The public folder is configured but won't serve files if:

        The folder doesn't exist

        No index.html is present (Express looks for this by default)

        Other routes (like /) override it

    Uncomment express.json() if you need to handle JSON payloads

    The MySQL connection uses fallback values if .env isn't configured
