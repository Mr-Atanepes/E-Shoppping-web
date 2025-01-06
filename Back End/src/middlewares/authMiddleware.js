import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

/**
 * Middleware to authenticate general users.
 * Validates the JWT token and attaches user information to the request.
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Token missing or invalid' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.jwt_secret_key);

    req.user = decoded; // Attach user info to the request object
    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error(`Authentication error: ${error.message}`);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Middleware to protect admin-only routes.
 * Validates the JWT token, checks if the user exists and is an admin.
 */
const protectAdminRoute = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Token missing or invalid' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user exists in the database and is an admin
    const admin = await User.findById(decoded.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin user not found' });
    }
    if (!admin.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Not an admin' });
    }

    // Attach admin info to the request object
    req.user = admin;
    next();
  } catch (error) {
    console.error(`Admin route protection error: ${error.message}`);
    res.status(401).json({ message: 'Invalid token or authorization denied' });
  }
};

export { authenticate, protectAdminRoute };



export default authenticate;
