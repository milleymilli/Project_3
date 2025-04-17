const jwt = require("jsonwebtoken");
const redis = require("./redis"); // Assuming Redis for token blacklist

// Token invalidation
app.post("/api/logout", authenticateToken, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // Add to blacklist (expires when original token would expire)
    const decoded = jwt.decode(token);
    await redis.set(
      `blacklist_${token}`,
      "1",
      "PX",
      decoded.exp * 1000 - Date.now()
    );

    res.setHeader("Clear-Site-Data", '"cache", "storage"');
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Logout processing failed" });
  }
});
