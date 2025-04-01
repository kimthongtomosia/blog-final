import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';
import fastify from 'fastify';
import { FastifyInstance } from 'fastify';
import fastifyJwt from 'fastify-jwt';
import pino from 'pino';
import { Sequelize } from 'sequelize';

import sequelizePlugin from './config/db.config';
// import Post from './models/post.model';
import User from './models/user.model';
import authRoutes from './routes/auth.routes';
// import PostRoutes from './routes/post.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

export async function createApp() {
  // Cấu hình logging
  const logDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logStream = pino.destination({
    dest: path.join(logDir, 'requests.log'),
    sync: false,
  });

  const app = fastify({
    logger: {
      level: 'info',
      stream: logStream,
      redact: ['req.headers.authorization'],
      serializers: {
        time: () => `,"time":"${new Date().toISOString()}"`,
      },
      timestamp: () => `,"timestamp":"${new Date().toLocaleString()}"`,
    },
  });

  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key', // Đảm bảo rằng bạn đã cấu hình secret trong biến môi trường
  });

  app.addHook('onRequest', async (request, reply) => {
    try {
      const token = request.headers['authorization']?.split(' ')[1]; // Lấy token từ header Authorization
      if (token) {
        const decoded = app.jwt.verify(token); // Giải mã token
        request.user = decoded; // Gán user vào request
      } else {
        reply.status(401).send({ error: 'Unauthorized: Token is missing' });
      }
    } catch (error) {
      reply.status(401).send({ error: 'Unauthorized: Invalid token' });
    }
  });

  return app;
}

export async function setupDatabase(app: FastifyInstance) {
  // 1. Đăng ký database plugin
  await app.register(sequelizePlugin);

  // 2. Lấy sequelize instance
  const sequelize = app.sequelize as Sequelize;

  // 3. Khởi tạo model
  User.initialize(sequelize);
  // Post.initModel(sequelize);

  // 4. Đồng bộ model với database (chỉ cho development)
  if (process.env.NODE_ENV === 'development') {
    await sequelize.sync({ alter: true });
    app.log.info('Database synced');
  }
}

export async function setupRoutes(app: FastifyInstance) {
  // Đăng ký routes
  app.register(authRoutes, { prefix: '/api/auth' });
  app.register(userRoutes, { prefix: '/api/users' });
  // app.register(PostRoutes, { prefix: '/api/posts' });

  app.get(
    '/',
    {
      schema: {
        description: 'API',
        tags: ['API'],
        response: {
          200: {
            type: 'array',
          },
        },
      },
    },
    async (request, reply) => {
      try {
        reply.send('Hello Docker with Node.js!');
      } catch (error) {
        app.log.error('Failed to fetch users:', error);
        reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  );
}
