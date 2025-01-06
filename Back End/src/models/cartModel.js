import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to the Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
// {
//   "username":"randome",
//   "password":"randomuser34"
// }
// {
//   "success": true,
//   "user": {
//       "_id": "67790ddf41ec8ca8e29ab2f2",
//       "username": "randome",
//       "password": "$2b$10$osGQ8jfth1apkDOs0qDvXuA13pYebkVJxcov1eQFOinAtWl6cD876",
//       "email": "randome23@gmail.com",
//       "isAdmin": false,
//       "products": [],
//       "createdAt": "2025-01-04T10:30:55.461Z",
//       "updatedAt": "2025-01-04T10:30:55.461Z",
//       "__v": 0
//   },
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NzkwZGRmNDFlYzhjYThlMjlhYjJmMiIsImlhdCI6MTczNTk4NjkzOSwiZXhwIjoxNzM1OTkwNTM5fQ.JwdC27t8EP1CnUm7G7kZlKLf0aStz4Qv0dRrv9Xi9lo"
// }