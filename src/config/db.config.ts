import fp from 'fastify-plugin';
import { Sequelize } from 'sequelize';

export default fp(async function (fastify) {
  const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
    dialect: 'postgres',
    logging: false,
  });

  try {
    await sequelize.authenticate();
    fastify.log.info('Database connection established');
  } catch (error) {
    fastify.log.error('Database connection failed:', error);
    throw error;
  }

  fastify.decorate('sequelize', sequelize);
});
