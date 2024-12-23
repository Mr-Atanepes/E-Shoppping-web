import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js'; // Assuming you're using a User model for admins too

// Admin Sign-Up function (creating new admin)
export const adminSignUp = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new admin user
    const newAdmin = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: true, // Flag this user as an admin
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully', newAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Admin Login function (login for admin)
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin user by email
    const admin = await User.findOne({ email });
    if (!admin || !admin.isAdmin) {
      return res.status(400).json({ message: 'Admin not found or not authorized' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token for the admin
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expiration
    });

    // Send response with the token
    res.status(200).json({ message: 'Admin login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Admin Dashboard function (fetch data for the admin dashboard)
export const getAdminDashboard = async (req, res) => {
  // The admin authentication and authorization are handled by middleware
  try {
    // Fetch data for the admin dashboard (e.g., user stats, products, etc.)
    const users = await User.find(); // Example: Fetch all users
    res.status(200).json({ message: 'Admin Dashboard Data', users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};
