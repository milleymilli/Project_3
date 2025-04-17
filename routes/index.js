// const express = require("express");
// const router = express.Router();

// // Basic home page route
// router.get("/", (req, res) => {
//   res.render("index", {
//     title: "Recipe App",
//     message: "Welcome to our Recipe Application",
//   });
// });

// // Login page route
// router.get("/login", (req, res) => {
//   res.render("login", { title: "Login" });
// });

// // About page route
// router.get("/about", (req, res) => {
//   res.render("about", { title: "About Us" });
// });

// // Serve the main app page (protected)
// router.get("/app", (req, res) => {
//   if (!req.isAuthenticated()) {
//     return res.redirect("/login");
//   }
//   res.render("app", {
//     title: "Recipe Dashboard",
//     user: req.user,
//   });
// });

// module.exports = router;
