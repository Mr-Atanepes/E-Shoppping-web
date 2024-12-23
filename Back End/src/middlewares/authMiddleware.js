import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js '; // Assuming you're using a User model for admins too

export const protectAdminRoute = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user exists and is an admin
    const admin = await User.findById(decoded.id);
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Attach the user information to the request object
    req.user = admin;
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token, authorization denied' });
  }
};
