const { ApiResponse } = require('../utils/ApiResponse');

const errorHandler = (err, req, res, next) => {
  console.error('[Error]', err.message);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return ApiResponse.error(res, 'Validation error', 422, errors);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return ApiResponse.error(res, `${field} already exists`, 409);
  }

  if (err.name === 'CastError') {
    return ApiResponse.error(res, 'Invalid ID format', 400);
  }

  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.error(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.error(res, 'Token expired', 401);
  }

  const statusCode = err.statusCode || 500;
  return ApiResponse.error(res, err.message || 'Internal server error', statusCode, err.errors || null);
};

const notFound = (req, res) => {
  ApiResponse.error(res, `Route not found: ${req.originalUrl}`, 404);
};

module.exports = { errorHandler, notFound };
