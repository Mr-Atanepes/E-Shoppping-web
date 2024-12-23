// controllers/cartController.js
import Cart from "../models/cartModel.js"; // Import the Cart model

// Add item to cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user?.id; // Ensure that `userId` is available from `req.user`

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  if (!productId || quantity <= 0) {
    return res.status(400).json({ message: "Invalid product ID or quantity" });
  }

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] }); // Create a new cart if none exists
    }

    const existingItem = cart.items.find(
      (item) => item.productId === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity; // Update quantity if item exists
    } else {
      cart.items.push({ productId, quantity }); // Add new item if it doesn't exist
    }

    await cart.save();
    res.status(200).json(cart); // Send updated cart
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

// Delete product from cart
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
