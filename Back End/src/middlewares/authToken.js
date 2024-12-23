// 1. Check if there is authToken
// 2. If there is authtoken verify if there is a session created
// 3. If there is no session created, create one.
// 4. Finally return next function on the line

import jwt from "jsonwebtoken";

// Auth middleware to verify JWT token and handle sessions
const authToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied: Token missing" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    // Initialize session if not present (express-session should handle this)
    if (!req.session) {
      req.session = {};
    }

    req.session.user = {
      id: verified.id,
      email: verified.email, // Assuming email is part of the token payload
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please login again" });
    }

    console.error("JWT Verification Error:", error.message);
    res.status(403).json({ message: "Invalid token, access denied" });
  }
};

export default authToken;
