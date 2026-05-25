// src/middleware/requireAuth.js
function requireAuth(req, res, next) {
  if (typeof req.isAuthenticated !== "function") {
    console.error("req.isAuthenticated is not a function. Passport might not be initialized.");
    return res.status(500).json({ message: "Internal server error" });
  }

  if (req.isAuthenticated()) {
    return next(); // ✅ Authenticated → proceed
  }

  // ❌ Not authenticated
  return res.status(401).json({ message: "Not authenticated" });
}

module.exports = requireAuth;
