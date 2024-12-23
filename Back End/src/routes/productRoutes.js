import { Router } from "express";
import {
  createProduct,    // Function to create a product
  deleteProduct,    // Function to delete a product by ID
  getAllProducts,   // Function to get all products
  updateProduct,    // Function to update a product by ID
  searchProducts,   // Function to search products
} from "../controllers/productControllers.js";

const router = Router();

// Route to get all products with optional pagination
router.get("/", getAllProducts);

// Route to search for products by name or description
router.get("/search", searchProducts); // New search route

// Route to create a new product, now handles image upload
router.post("/add", createProduct);

// Route to delete a product by ID
router.delete("/delete/:id", deleteProduct);

// Route to update a product by ID, now handles image upload
router.put("/update/:id", updateProduct);

export default router;
