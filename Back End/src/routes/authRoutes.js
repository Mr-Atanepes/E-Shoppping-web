// routes/authRoutes.js
import { Router } from "express";
import { registerUser, login, sendOtp, verifyOtp, resetPassword } from "../controllers/authControllers.js";
import { sendVerificationEmail } from "../services/emailService.js";
import User from "../models/UserModel.js"; // Assuming you have a User model
import crypto from "crypto";
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
const router = Router();

// Routes for OTP functionality
router.post('/send-otp', sendOtp); // Route to send OTP
router.post('/verify-otp', verifyOtp); // Route to verify OTP
router.post('/reset-password', resetPassword); // Route to reset password



// Modified registration route
router.post("/register", [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword; // Store the hashed password

    // Call the existing registerUser function
    await registerUser(req, res);

    // After successful registration, generate and send verification email
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const verificationToken = crypto.randomBytes(20).toString("hex");
      user.verificationToken = verificationToken;
      user.isVerified = false; // Ensure the user starts as unverified
      await user.save();

      await sendVerificationEmail(user.email, verificationToken);

      res.status(201).json({
        message:
          "User registered. Please check your email to verify your account.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error during registration process",
      error: error.message,
    });
  }
});

router.post("/login", login);

// New route for email verification
router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying email", error: error.message });
  }
});
// Reset password route
router.post("/reset-password", async (req, res) => {
  try {
    const { email } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate reset token, send email with reset link
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    await user.save();

    await sendResetEmail(user.email, resetToken); // This sends an email with the reset link

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error: error.message });
  }
});

export default router;
