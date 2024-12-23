// utils/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message || err); // Log only message for clarity, fallback if undefined

  const statusCode = err.statusCode || 500; // Use status code from error object if available
  const errorMessage = err.message || "An unexpected error occurred"; // Custom or default error message

  res.status(statusCode).json({
    success: false,
    error: errorMessage,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Show stack trace in development mode only
  });
};

export default errorHandler;
