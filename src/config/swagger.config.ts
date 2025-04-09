import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';

export async function setupSwagger(app: FastifyInstance) {
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Toi Blog API',
        description: 'Tài liệu API cho hệ thống blog cá nhân',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3000}`,
          description: 'Local server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
    hideUntagged: true,
  });
  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      persistAuthorization: true,
      filter: true,
    },
    staticCSP: true,
    initOAuth: {},
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
  });

  // Thêm route test để kiểm tra
  app.get('/docs/healthcheck', async () => {
    return { status: 'Swagger UI is working' };
  });
}
