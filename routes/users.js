// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcrypt");
// const saltRounds = 10;

// // Initialize with db connection
// module.exports = (db) => {
//   /**
//    * @route GET /users
//    * @description Get all users
//    */
//   router.get("/", (req, res) => {
//     db.query("SELECT id, name, email FROM users", (err, results) => {
//       if (err) {
//         console.error("Database error:", err);
//         return res.status(500).json({
//           success: false,
//           error: "Failed to fetch users",
//         });
//       }
//       res.json({
//         success: true,
//         data: results,
//       });
//     });
//   });

//   /**
//    * @route POST /users
//    * @description Register a new user
//    */
//   router.post("/", async (req, res) => {
//     try {
//       const { name, email, password } = req.body;

//       // Validation
//       if (!name || !email || !password) {
//         return res.status(400).json({
//           success: false,
//           error: "Name, email and password are required",
//         });
//       }

//       // Check if email exists
//       const [existing] = await db
//         .promise()
//         .query("SELECT id FROM users WHERE email = ?", [email.toLowerCase()]);

//       if (existing.length > 0) {
//         return res.status(409).json({
//           success: false,
//           error: "Email already registered",
//         });
//       }

//       // Hash password and create user
//       const hash = await bcrypt.hash(password, saltRounds);
//       const [result] = await db
//         .promise()
//         .query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
//           name,
//           email.toLowerCase(),
//           hash,
//         ]);

//       res.status(201).json({
//         success: true,
//         data: {
//           id: result.insertId,
//           name,
//           email,
//         },
//       });
//     } catch (err) {
//       console.error("Registration error:", err);
//       res.status(500).json({
//         success: false,
//         error:
//           err.code === "ER_DUP_ENTRY"
//             ? "Email already exists"
//             : "Registration failed",
//       });
//     }
//   });

//   return router;
// };
