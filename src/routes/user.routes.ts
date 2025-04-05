import { FastifyInstance } from 'fastify';

import { getUserMe, updateUserMe, changePassword, getUserById } from '../controllers/user.controller';
import { getUserMeSchema, updateUserMeSchema, changePasswordSchema, getUserByIdSchema } from '../schemas/user.schema';

export default async function (fastify: FastifyInstance) {
  // GET /users/me - Yêu cầu xác thực JWT
  fastify.post('/me', { ...getUserMeSchema, onRequest: [fastify.authenticate] }, getUserMe);

  // PUT /users/me - Yêu cầu xác thực JWT
  fastify.put(
    '/me',
    {
      ...updateUserMeSchema,
      onRequest: [fastify.authenticate],
    },
    updateUserMe
  );

  // POST /users/me/change-password - Yêu cầu xác thực JWT
  fastify.post(
    '/me/change-password',
    {
      ...changePasswordSchema,
      onRequest: [fastify.authenticate],
    },
    changePassword
  );

  fastify.get('/:id', getUserByIdSchema, getUserById);
}
