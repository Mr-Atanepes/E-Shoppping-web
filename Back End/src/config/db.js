// config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables
// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
  } catch (error) {
    console.log("Error connecting to database: ", error);
  }

  // try {
  //   const uri =
  //     process.env.MONGODB_URI || "mongodb://localhost:27017/Users_Collection";
  //   await mongoose.connect(uri, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   });
  //   console.log("MongoDB connected");
  // } catch (error) {
  //   console.error("MongoDB connection failed:", error.message);
  //   process.exit(1);
  // }
};

// Function for graceful shutdown
const gracefulShutdown = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  } catch (shutdownError) {
    console.error("Error during shutdown:", shutdownError);
    process.exit(1);
  }
};

// Signal listeners for shutdown
process.on("SIGINT", gracefulShutdown); // For manual interruption
process.on("SIGTERM", gracefulShutdown); // For termination signal in deployment

export default connectDB;
