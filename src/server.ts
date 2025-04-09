import cors from '@fastify/cors';

import { createApp, setupDatabase, setupRoutes } from './app';
import { setupSwagger } from './config/swagger.config';

const start = async () => {
  try {
    const app = await createApp();
    app.register(cors, {
      origin: ['*'],
    });

    // Thiết lập database
    await setupDatabase(app);

    // Thiết lập Swagger
    await setupSwagger(app);

    // Thiết lập routes
    await setupRoutes(app);

    // Khởi động server
    await app.listen({
      port: Number(process.env.PORT) || 3000,
      host: '0.0.0.0',
    });

    console.log(`Server running on port ${process.env.PORT}`);
    app.log.info(`Server running on port ${process.env.PORT}`);
    app.log.info(`Swagger UI available at http://localhost:${process.env.PORT || 3000}/docs`);
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
};

start();
