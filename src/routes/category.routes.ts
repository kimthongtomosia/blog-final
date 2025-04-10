import { FastifyInstance } from 'fastify';

import CategoryController from '../controllers/categories.controller';
import { CreatCateSchema, getCateSchema, editCateSchema, deleteCateSchema } from '../schemas/category.schema';

export default async function (fastify: FastifyInstance) {
  fastify.register(async function (authenticatedRoutes) {
    authenticatedRoutes.addHook('onRequest', fastify.authenticate);
    authenticatedRoutes.post('/create', CreatCateSchema, CategoryController.create);
    authenticatedRoutes.put('/edit/:id', editCateSchema, CategoryController.edit);
    authenticatedRoutes.delete('/delete/:id', deleteCateSchema, CategoryController.delete);
  });
  fastify.get('/index', getCateSchema, CategoryController.show);
}
