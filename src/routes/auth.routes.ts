import { FastifyInstance } from 'fastify';

import User from '../models/user.model';

export default async function authRoutes(fastify: FastifyInstance) {
  // Route đăng nhập
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body;

    try {
      // Tìm người dùng trong cơ sở dữ liệu (hoặc một nơi nào đó)
      const user = (await User.findOne({ where: { email } })) as User;

      if (!User || user.password !== password) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      // Tạo JWT Token
      const token = fastify.jwt.sign({
        userId: user.id,
        email: user.email,
        isAdmin: user.is_admin,
      });

      reply.send({ token });
    } catch (error) {
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
}
