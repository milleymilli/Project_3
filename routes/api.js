require("dotenv").config();
const path = require("path");
const bcrypt = require("bcrypt");
("");
const saltRounds = 10;
const authenticateToken = require("./auth");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (app, db) => {
  // Favicon route
  app.get("/favicon.ico", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "favicon.ico"), {
      headers: {
        "Content-Type": "image/x-icon",
      },
    });
  });
  // // Home route
  // app.get("/", (req, res) => {
  //   res.sendFile(path.join(__dirname, "public", "login.html"));
  // });

  // GET ALL USERS
  app.get("/api/users", (req, res) => {
    console.log("GET /api/users hit");
    db.query("SELECT * FROM users", (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });

  // REGISTER A USER
  app.post("/api/register", authenticateToken, async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields required" });
      }

      const [users] = await db
        .promise()
        .query("SELECT uid FROM users WHERE email = ?", [email.toLowerCase()]);

      if (users.length > 0) {
        return res.status(400).json({ error: "Email already in use" });
      }

      const hashPassword = await bcrypt.hash(password, saltRounds);
      const [result] = await db
        .promise()
        .query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
          name,
          email.toLowerCase(),
          hashPassword,
        ]);

      res.status(201).json({
        success: true,
        userId: result.insertId,
      });
    } catch (err) {
      console.error("Registration error:", err);
      res.status(500).json({
        error:
          err.code === "ER_DUP_ENTRY"
            ? "Email already exists"
            : "Registration failed",
      });
    }
  });

  // GET ALL RECIPES
  app.get("/api/recipes", (req, res) => {
    db.query("SELECT * FROM recipes", (err, results) => {
      if (err) res.status(500).json({ error: err.message });
      else res.json(results);
    });
  });

  //ADD A NEW RECIPE
  app.post("/api/recipe", authenticateToken, async (req, res) => {
    console.log("Authenticated User:", req.user); // Debug log

    try {
      //const user = JSON.parse(req.session.user);
      const {
        name,
        instructions,
        description,
        image,
        type,
        Cookingtime,
        ingredients,
      } = req.body;
      if (
        !name ||
        !instructions ||
        !description ||
        !type ||
        !Cookingtime ||
        !ingredients
      ) {
        return res.status(400).json({ error: "All fields required" });
      }
      const uid = req.user.userId;
      const [recipe] = await db
        .promise()
        .query("SELECT * FROM recipes WHERE name = ?", [name.toLowerCase()]);

      if (recipe.length > 0) {
        return res.status(400).json({ error: "recipe already exist" });
      }
      const registeredRecipe = await db
        .promise()
        .query(
          "INSERT INTO recipes ( name, description,type,Cookingtime,ingredients,instructions,image,uid) VALUES (?,?,?,?,?,?,?,?)",
          [
            name.toLowerCase(),
            description.toLowerCase(),
            type.toLowerCase(),
            Cookingtime,
            ingredients.toLowerCase(),
            instructions.toLowerCase(),
            image ? image.toLowerCase() : null,
            uid,
          ]
        );

      res.status(201).json({
        success: true,
        recipeId: registeredRecipe[0].rid,
      });
    } catch (err) {
      console.error("Registration error:", err);
      res.status(500).json({
        error:
          err.code === "ER_DUP_ENTRY"
            ? "Recipe already exists"
            : "Registration failed",
      });
    }
  });

  // GET RECIPE BY ID, WHEN CLICKED THE VIEW BUTTON
  app.get("/api/recipes/:rid", async (req, res) => {
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

  // LOGGING AN AUTORIZHED USER
  app.post("/api/login", async (req, res) => {
    console.log("📩 POST /login hit");

    try {
      const { email, password } = req.body;

      // Debug logging
      console.log("Login attempt for:", email);

      // 1. Validate user credentials
      const [users] = await db
        .promise()
        .query(`SELECT uid, email, password FROM users WHERE email = ?`, [
          email.toLowerCase(),
        ]);

      if (users.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = users[0];

      // 2. Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // 3. Generate JWT
      const token = jwt.sign({ userId: user.uid }, JWT_SECRET, {
        expiresIn: "1h",
      });
      console.log("Login successful, sending token.");
      // 4. Respond with token
      res.json({
        token,
        user: {
          id: user.uid,
          email: user.email,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
};
