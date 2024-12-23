import express from 'express';  // Import express
import { createOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder } from '../controllers/orderController.js';

const router = express.Router();

// POST route to create an order
router.post('/orders', createOrder);

// GET route to get all orders
router.get('/orders', getAllOrders);

// GET route to get a specific order by ID
router.get('/orders/:id', getOrderById);

// PUT route to update an order's status
router.put('/orders/:id', updateOrderStatus);

// DELETE route to delete an order
router.delete('/orders/:id', deleteOrder);

export default router;
