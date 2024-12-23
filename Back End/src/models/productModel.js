// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxlength: 100,
    },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, maxlength: 500 },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    imageUrl: {  // Add this field to store image URL/path
      type: String,
      default: null,
    },
  },
  { timestamps: true }
); // Automatically manage createdAt and updatedAt

const Product = mongoose.model("Product", productSchema);
export default Product;
