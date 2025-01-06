import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/UserModel.js";
import { sendVerificationEmail } from "../services/emailService.js"; // Import your email service
// import { body, validationResult } from 'express-validator';
// Helper function to generate JWT
const generateToken = (userId) => {
  if (!process.env.jwt_secret_key) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id: userId }, process.env.jwt_secret_key, { expiresIn: "1h" });
};

// Login User

export const login = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!password || (!email && !username)) {
      return res.status(400).json({ message: 'Username/Email and password are required' });
    }

    const user = email
      ? await User.findOne({ email })
      : await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password (bcrypt will handle the hash comparison)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      process.env.jwt_secret_key,
      { expiresIn: '1h' }
    );
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const protectRoute = async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select('password'); 
      // Exclude password
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json({
          name: user.name,
          email: user.email,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
}
// Send OTP to user's email for password reset
export const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = crypto.randomBytes(3).toString('hex'); // Generates a 6-character OTP (3 bytes)
    
    // Store OTP and expiration time in the database
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 3600000; // OTP expires in 1 hour
    await user.save();

    // Setup email transporter using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD, // Use environment variables for security
      },
    });

    // Define email options
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with success
    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error sending OTP' });
  }
};

// Verify OTP


// Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the OTP matches
    if (user.resetOtp !== otp) { // Use 'resetOtp' instead of 'otp'
      return res.status(400).json({ message: "Invalid OTP" });
    }
    
    // If OTP is valid, you can mark the user as verified or perform other actions
    user.isVerified = true; // Example action
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if OTP matches and has not expired
    if (user.resetOtp !== otp || Date.now() > user.resetOtpExpire) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    user.resetOtp = undefined; // Clear OTP field after successful reset
    user.resetOtpExpire = undefined; // Clear OTP expiration field
    await user.save();
    
    // Respond with success message
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error resetting password" });
  }
};

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the email or username already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Create a new user (password will be hashed automatically in the model)
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Server error during signup' });
  }
};


