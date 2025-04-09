import { FastifyInstance } from 'fastify';

import UserController from '../controllers/user.controller';
import {
  getUserMeSchema,
  updateUserMeSchema,
  changePasswordSchema,
  getUserByIdSchema,
  editAvatarSchema,
} from '../schemas/user.schema';

export default async function (fastify: FastifyInstance) {
  fastify.register(async function (authenticatedRoutes) {
    authenticatedRoutes.addHook('onRequest', fastify.authenticate);
    authenticatedRoutes.get('/me', getUserMeSchema, UserController.index);
    authenticatedRoutes.put('/me', updateUserMeSchema, UserController.update);
    authenticatedRoutes.post('/me/change-password', changePasswordSchema, UserController.changePassword);
    // update avatar
    authenticatedRoutes.put('/me/avatar', editAvatarSchema, UserController.editAvatar);
  });

  // GET /users/:id - Lấy thông tin user theo ID (public)
  fastify.get('/:id', getUserByIdSchema, UserController.show);
}
