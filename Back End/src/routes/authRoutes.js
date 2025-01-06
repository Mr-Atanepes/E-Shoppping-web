import { Router } from "express";
import { 
  login, 
  sendOtp, 
  verifyOtp, 
  resetPassword, 
  signup, 
  protectRoute 
} from "../controllers/authControllers.js";
import User from "../models/UserModel.js"; // Assuming you have a User model
import crypto from "crypto";

const router = Router();

// Routes for OTP functionality
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

// Routes for user registration
router.post("/signup", signup);
router.post('/login', login);

// Protecting the `/profile` route
router.get('/profile', protectRoute, (req, res) => {
  res.status(200).json({ user: req.user }); 
});

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
    res.status(500).json({ message: "Error verifying email", error: error.message });
  }
});

// Reset password email route
router.post("/send-reset-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpire = Date.now() + 3600000; 
    await user.save();

    await sendResetEmail(user.email, resetToken); 

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error: error.message });
  }
});

export default router;
