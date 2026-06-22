const { nodeEnv } = require('../config/env');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  if (nodeEnv === 'development') {
    console.error(err.stack);
  }

  // Prisma known errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: {
        message: 'A record with this value already exists',
        code: 'DUPLICATE_ENTRY',
      },
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: {
        message: 'Record not found',
        code: 'NOT_FOUND',
      },
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Internal server error';

  res.status(statusCode).json({
    error: {
      message,
      code: err.code || 'INTERNAL_ERROR',
    },
  });
};

module.exports = { errorHandler };
