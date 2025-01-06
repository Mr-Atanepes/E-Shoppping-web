import express from "express";
import { addToCart, deleteCartItem, updateCartItem, getCart } from "../controllers/cartControllers.js";
// Correctly importing the delete method 

const router = express.Router();

// Route to get all items in the cart
router.get("/", getCart);

// Route to add an item to the cart
router.post("/add", addToCart);

// Route to update an item in the cart
router.put("/update", updateCartItem);

// Route to remove an item from the cart
router.delete("/remove/:productId", deleteCartItem); // Ensure the correct parameter is used

export default router;
