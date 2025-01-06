// 1. Check if there is authToken
// 2. If there is authtoken verify if there is a session created
// 3. If there is no session created, create one.
// 4. Finally return next function on the line

import jwt from "jsonwebtoken";

// Auth middleware to verify JWT token and handle sessions
const authToken = (req, res, next) => {
  try {
    // 1. Extract token from cookies or Authorization header
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied: Token missing" });
    }

    // 2. Verify token and decode payload
    const verified = jwt.verify(token, process.env.jwt_secret_key);
    req.user = verified; // Attach user info to the request object

    // 3. Check or initialize session
    if (!req.session) {
      req.session = {}; // Ensure the session exists
    }

    req.session.user = {
      id: verified.id,
      email: verified.email, // Assuming email exists in the token payload
    };

    // 4. Proceed to the next middleware or route handler
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please login again" });
    }

    console.error("JWT Verification Error:", error.message);
    return res.status(403).json({ message: "Invalid token, access denied" });
  }
};

export default authToken;
