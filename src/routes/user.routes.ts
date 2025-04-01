// import bcrypt from 'bcrypt';
import { FastifyInstance } from 'fastify';

import { User } from '@app/models/user.model';

// Định nghĩa schema cho Swagger
const UserSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    email: { type: 'string' },
    is_admin: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/',
    {
      schema: {
        description: 'Lấy danh sách người dùng',
        tags: ['Users'],
        response: {
          200: {
            type: 'array',
            items: UserSchema,
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const users = await User.findAll();
        return users;
      } catch (error) {
        fastify.log.error('Failed to fetch users:', error);
        reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  );

  // fastify.post(
  //   '/',
  //   {
  //     schema: {
  //       description: 'Tạo người dùng mới',
  //       tags: ['Users'],
  //       body: {
  //         type: 'object',
  //         required: ['username', 'email', 'password'],
  //         properties: {
  //           username: { type: 'string', minLength: 3 },
  //           email: { type: 'string', format: 'email' },
  //           password: { type: 'string', minLength: 6 },
  //         },
  //       },
  //       response: {
  //         201: {
  //           type: 'object',
  //           properties: {
  //             id: { type: 'number' },
  //             username: { type: 'string' },
  //             email: { type: 'string' },
  //             created_at: { type: 'string', format: 'date-time' },
  //           },
  //         },
  //         400: {
  //           type: 'object',
  //           properties: {
  //             error: { type: 'string' },
  //             details: { type: 'array', items: { type: 'string' } },
  //           },
  //         },
  //       },
  //     },
  //   },
  //   async (request, reply) => {
  //     try {
  //       const { username, email, password } = request.body as any;
  //       const hashedPassword = await bcrypt.hash(password, 10);

  //       const newUser = await User.create({
  //         username,
  //         email,
  //         password: hashedPassword,
  //         is_active: true,
  //         is_admin: false,
  //       });

  //       reply.status(201).send({
  //         id: newUser.id,
  //         username: newUser.username,
  //         email: newUser.email,
  //         created_at: newUser.created_at,
  //       });
  //     } catch (error) {
  //       fastify.log.error('Failed to create user:', error);

  //       if (error.name === 'SequelizeUniqueConstraintError') {
  //         reply.status(400).send({
  //           error: 'Duplicate field value',
  //           details: error.errors.map((e: any) => `${e.path} already exists`),
  //         });
  //       } else if (error.name === 'SequelizeValidationError') {
  //         reply.status(400).send({
  //           error: 'Validation error',
  //           details: error.errors.map((e: any) => e.message),
  //         });
  //       } else {
  //         reply.status(400).send({
  //           error: 'Bad Request',
  //           details: [error.message],
  //         });
  //       }
  //     }
  //   }
  // );
}
