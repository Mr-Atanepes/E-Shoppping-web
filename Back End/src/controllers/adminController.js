import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js'; // Assuming you're using a User model for admins too
import Product from '../models/productModel.js'; // Import Product model
import Cart from '../models/cartModel.js'; // Import Cart model

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

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find the user by email
    const admin = await User.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Check if the user has admin privileges
    if (!admin.isAdmin) {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }

    // Compare the entered password with the stored hash
    

    // Generate JWT token for admin
    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.jwt_secret_key,  // Make sure you're using the same secret here
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during admin login', error });
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

// Add Product function
export const addProduct = async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const newProduct = new Product({ name, description, price });
    await newProduct.save();
    broadcast({ type: 'ADD_PRODUCT', product: newProduct }); // Notify clients
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
  res.status(201).json({ message: 'Product added successfully', newProduct });

};

// Delete Product function
export const deleteProduct = async (req, res) => {
  const { id } = req.params; // Get the product ID from the request parameters

  try {
    const deletedProduct = await Product.findByIdAndDelete(id); // Delete the product
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    broadcast({ type: 'DELETE_PRODUCT', productId: id }); // Notify clients of the deleted product
    res.status(200).json({ message: "Product deleted successfully" }); // Respond with success message
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

// Update Product function
export const updateProduct = async (req, res) => {
  const { id } = req.params; // Get the product ID from the request parameters
  const { name, description, price } = req.body; // Get updated product details from the request body

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, { name, description, price }, { new: true }); // Update the product and return the new document
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    broadcast({ type: 'UPDATE_PRODUCT', product: updatedProduct }); // Notify clients of the updated product
    res.status(200).json(updatedProduct); // Respond with the updated product
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};


// Export all functions
