import fastify from 'fastify';
import { FastifyInstance, FastifyServerOptions } from 'fastify';

import sequelizePlugin from './db.config';

declare module 'fastify' {
  interface FastifyInstance {
    sequelize: any;
  }
}

export async function createApp(opts: FastifyServerOptions = {}): Promise<FastifyInstance> {
  const app = fastify(opts);

  // Register database
  await sequelizePlugin(app);

  // Health check endpoint
  app.get('/health', async () => {
    try {
      await app.sequelize.authenticate();
      return { status: 'ok', db: 'connected', timestamp: new Date().toISOString() };
    } catch (error) {
      return { status: 'error', db: 'disconnected' };
    }
  });

  return app;
}
