import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import session from "express-session";
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js"; // Import order routes
import Cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware setup
app.use(Cors({ origin: "http://localhost:3001", credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// Configure session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Database connection using Mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes setup
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes); // Add orderRoutes here

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
