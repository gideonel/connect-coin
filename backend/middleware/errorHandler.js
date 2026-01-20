// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Not found handler
const notFound = (req, res, next) => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Handle specific error types
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    message = errors.join(', ');
    statusCode = 400;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    message = 'Invalid ID format';
    statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token';
    statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Token expired';
    statusCode = 401;
  }

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    message = 'File too large. Maximum size is 10MB';
    statusCode = 400;
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    message = 'Too many files';
    statusCode = 400;
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    message = 'Unexpected file field';
    statusCode = 400;
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err,
    }),
  });
};

// Async handler wrapper to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  AppError,
  notFound,
  errorHandler,
  asyncHandler,
};
