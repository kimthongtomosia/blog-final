import { FastifyRequest } from 'fastify';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthTokenPayload {
  userId: number;
  username: string;
  isAdmin: boolean;
  exp: number; // Thời gian hết hạn của token (UNIX timestamp)
}

export interface AuthenticatedRequest extends FastifyRequest {
  user: AuthUser;
}

export interface PostRequest extends AuthenticatedRequest {
  body: {
    title: string;
    content: string;
    categoryId: number;
  };
}
