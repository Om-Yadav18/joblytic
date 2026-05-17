import { env } from '../config/env.js';

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Server Error',
    stack: env.nodeEnv === 'production' ? undefined : err.stack,
  });
};
