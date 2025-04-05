import dotenv from 'dotenv';
import { FastifyInstance } from 'fastify';

import {
  registerUser,
  testMail,
  verifyEmail,
  loginUsers,
  refreshToken,
  logoutUsers,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller';
import {
  registerUserSchema,
  testMailSchema,
  loginUserSchema,
  refreshTokenSchema,
  logoutUserSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas/auth.schema';

dotenv.config();

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', registerUserSchema, registerUser);

  fastify.get('/test-email', testMailSchema, testMail);

  fastify.get('/verify-email', verifyEmailSchema, verifyEmail);

  fastify.post('/login', loginUserSchema, loginUsers);

  fastify.post('/refresh-token', refreshTokenSchema, refreshToken);

  fastify.post('/logout', logoutUserSchema, logoutUsers);

  fastify.post('/forgot-password', forgotPasswordSchema, forgotPassword);

  fastify.post('/reset-password', resetPasswordSchema, resetPassword);
}
