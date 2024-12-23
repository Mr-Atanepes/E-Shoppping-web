import express from 'express';
import { adminLogin, adminSignUp, getAdminDashboard } from '../controllers/adminController.js';
import { protectAdminRoute } from '../middlewares/authMiddleware.js'; // Middleware to protect routes

const router = express.Router();

// Admin Sign-Up route (admin registration)
router.post('/signup', adminSignUp);

// Admin Login route
router.post('/login', adminLogin);

// Admin Dashboard route (protected, requires admin authentication)
router.get('/dashboard', protectAdminRoute, getAdminDashboard);

export default router;
