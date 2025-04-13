const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`Error: ${message} | Status: ${statusCode}`);

  res.status(statusCode).json({
      success: false,
      error: {
          message,
          statusCode,
          // ...(process.env.NODE_ENV === "development" && { stack: err.stack }) // Show stack trace in dev mode
      },
  });
};

export { errorMiddleware };
