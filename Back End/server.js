import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import session from "express-session";
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import authToken from "./src/middlewares/authMiddleware.js";
import { authenticate, protectAdminRoute } from "../Back End/src/middlewares/authMiddleware.js";
import Cors from "cors";
import helmet from "helmet";
import morgan from "morgan";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(Cors());

// Configure middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// Database connection using Mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes setup
app.use("/api/auth", authRoutes);
app.use("/api/admin",  adminRoutes); // Protect admin routes
app.use("/api/orders", authenticate, orderRoutes); // Protect user order routes
app.use("/api/products", productRoutes); // Public product routes
app.use("/api/cart", authenticate, cartRoutes); // Example route

// Protected route (authentication required)
app.use(authToken);

app.get("/protected", (req, res) => {
  res.json({ message: "This is protected data.", user: req.user });
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Error occurred during request to ${req.method} ${req.url} from ${req.ip}`);
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Server startup
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});








// /////////

// Middleware to parse cookies
app.use(cookieParser());

// Middleware for session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecret", // Use a secure secret in production
    resave: false,
    saveUninitialized: true,
  })
);

// Public route (no authentication required)
app.get("/public", (req, res) => {
  res.send("This is a public route.");
});

