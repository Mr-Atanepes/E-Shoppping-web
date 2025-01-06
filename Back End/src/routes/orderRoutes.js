import express from 'express';  // Import express
import { createOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder } from '../controllers/orderController.js';
import { protectAdminRoute } from '../middlewares/authMiddleware.js'; // Import the admin protection middleware
import { authenticate } from '../middlewares/authMiddleware.js'; // Import authenticate for user access

const router = express.Router();

// POST route to create an order (User access)
router.post('/orders', authenticate, createOrder);

// GET route to get all orders (Admin access)
router.get('/orders', protectAdminRoute, getAllOrders);

// GET route to get a specific order by ID (Admin access)
router.get('/orders/:id', protectAdminRoute, getOrderById);

// PUT route to update an order's status (Admin access)
router.put('/orders/:id/status', protectAdminRoute, updateOrderStatus);

// DELETE route to delete an order (Admin access)
router.delete('/orders/:id', protectAdminRoute, deleteOrder);

export default router;
