import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Generate JWT for authenticated user
 */
export const generateToken = (id) => {
  return jwt.sign({ id }, env.jwtSecret, {
    expiresIn: env.jwtExpire,
  });
};
