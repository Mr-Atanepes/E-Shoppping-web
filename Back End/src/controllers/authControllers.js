import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/UserModel.js";
import { sendVerificationEmail } from "../services/emailService.js"; // Import your email service

// Helper function to generate JWT
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register User
export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Input validation
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });

    // Save new user
    await user.save();

    // Step 1: Generate a verification token
    const verificationToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Step 2: Send verification email
    await sendVerificationEmail(user.email, verificationToken);

    // Respond to the client
    res.status(201).json({
      message: "User created successfully. Please verify your email.",
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "User registration failed" });
  }
};

// Login User
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Input validation
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Respond with user info and token
    res.status(200).json({
      message: "Login successful",
      token,
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Login failed" });
  }
};

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
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

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

    // If OTP is valid, respond with success
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error verifying OTP" });
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
    user.resetOtp = undefined; // Clear the OTP
    user.resetOtpExpire = undefined; // Clear OTP expiration
    await user.save();

    // Respond with success message
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error resetting password" });
  }
};
