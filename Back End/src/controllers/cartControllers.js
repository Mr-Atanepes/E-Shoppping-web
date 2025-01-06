// controllers/cartController.js
import Cart from "../models/cartModel.js"; // Import the Cart model
import Product from "../models/productModel.js"; // Import the Product model
// Delete product from cart
export const deleteCartItem = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Filter out the item to be deleted
    cart.items = cart.items.filter((item) => item.productId !== productId);
    await cart.save();
    res.status(200).json(cart); // Return updated cart
  } catch (error) {
    console.error("Error deleting product from cart:", error.message);
    res.status(500).json({ message: "Error deleting product from cart", error });
  }
};

// Update item quantity in cart
export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  if (!productId || quantity <= 0) {
    return res.status(400).json({ message: "Invalid product ID or quantity" });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const existingItem = cart.items.find(
      (item) => item.productId === productId
    );
    if (existingItem) {
      existingItem.quantity = quantity;
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Error updating cart item:", error.message);
    res.status(500).json({ message: "Error updating cart item", error });
  }
};

// Get cart contents
export const getCart = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "name price" // Fetch only necessary fields
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error retrieving cart:", error.message);
    res.status(500).json({ message: "Error retrieving cart", error });
  }
};
// Add item to cart
// Function to handle adding items to the cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  
  // Use a valid user ID from your database
 const userId = req.user?.id;
 
 if (!userId) {
   return res.status(401).json({ message: "Unauthorized access" });
 } // Replace with an actual user ID

  try {
    // Validate product existence
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Add item to cart logic
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      // Create a new cart if it doesn't exist
      const newCart = new Cart({ userId, items: [{ productId, quantity }] });
      await newCart.save();
    } else {
      // Check if the item already exists in the cart
      const existingItem = cart.items.find(item => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += quantity; // Update quantity
      } else {
        cart.items.push({ productId, quantity }); // Add new item
      }
      await cart.save(); // Save cart
    }

    return res.status(200).json({ message: 'Item added to cart successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding item to cart', error });
  }
};