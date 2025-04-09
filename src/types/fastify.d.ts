import { User } from '../models/user.model';
import { FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user: User;
    file: any;
  }

  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
      done: (err?: Error) => void
    ) => void;
  }
}
