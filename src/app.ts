import fs from 'fs';
import path from 'path';

import fjwt from '@fastify/jwt';
import dotenv from 'dotenv';
import fastify from 'fastify';
import { FastifyInstance } from 'fastify';
import pino from 'pino';
import { Sequelize } from 'sequelize';

import sequelizePlugin from './config/db.config';
// import Post from './models/post.model';
import User from './models/user.model';
import authRoutes from './routes/auth.routes';
// import PostRoutes from './routes/post.routes';
import userRoutes from './routes/user.routes';
// import { authenticate } from './utils/jwt.utils';

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

  app.register(fjwt, {
    secret: process.env.JWT_SECRET,
  });
  console.log('JWT Secret:', process.env.JWT_SECRET);

  // Đăng ký phương thức authenticate
  app.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      console.log(err);
      reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
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
  // await app.register(authenticate);

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
