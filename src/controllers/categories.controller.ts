import { FastifyReply, FastifyRequest } from 'fastify';
import removeAccents from 'remove-accents';
import { Op } from 'sequelize';

import Category from '@app/models/category.model';
import User from '@app/models/user.model';

interface CategoryBody {
  name: string;
  description: string;
  slug: string;
}
interface RequestParams {
  id: number;
}
class CategoryController {
  async create(request: FastifyRequest<{ Body: CategoryBody }>, reply: FastifyReply) {
    const { name, description } = request.body;

    const user = await User.findOne({ where: { is_admin: true } });

    if (!user) {
      return reply.status(400).send({ error: 'User is not an admin' });
    }

    if (!name) {
      return reply.status(400).send({ error: 'Category name is required' });
    }
    const categoryExist = await Category.findOne({ where: { name: { [Op.iLike]: name } } });

    if (categoryExist) {
      return reply.status(400).send({ error: 'Category already exists' });
    }

    try {
      const slug = removeAccents(name)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '');

      const category = await Category.create({
        name,
        slug,
        description: description || '',
      });

      return reply.status(201).send(category);
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: error.message });
    }
  }
  async show(request: FastifyRequest, reply: FastifyReply) {
    try {
      const [categories] = await Category.sequelize.query('SELECT * FROM categories');

      console.log(categories);

      if (categories.length > 0) {
        reply.status(200).send(categories);
      } else {
        reply.status(404).send({ message: 'Không có danh mục nào trong hệ thống' });
      }
    } catch (error) {
      reply.status(500).send({ error: 'Lỗi khi lấy danh sách danh mục: ' + error.message });
    }
  }

  async edit(request: FastifyRequest<{ Body: CategoryBody }>, reply: FastifyReply) {
    const categoryId = (request.params as RequestParams).id;
    const { name, description } = request.body;

    if (!categoryId) {
      return reply.status(404).send({ error: 'Category ID is required' });
    }

    const user = await User.findOne({ where: { is_admin: true } });

    if (!user) {
      return reply.status(400).send({ error: 'User is not an admin' });
    }

    if (!name) {
      return reply.status(400).send({ error: 'Name is required' });
    }

    const categoryExist = await Category.findOne({ where: { name: { [Op.iLike]: name } } });

    if (categoryExist) {
      return reply.status(400).send({ error: 'Category already exists' });
    }

    const slug = removeAccents(name)
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');

    try {
      // const query = `
      //   UPDATE categories
      //   SET
      //     name = '${name}',
      //     slug = '${slug}',
      //     description = ${description ? `'${description}'` : 'description'}
      //   WHERE id = ${categoryId}
      //   RETURNING *;
      // `;
      // const result = await Category.sequelize.query(query, {
      //   type: Sequelize.QueryTypes.SELECT,
      // });
      // if (!result || result.length === 0) {
      //   return reply.status(404).send({ error: 'Category not found' });
      // }
      // return reply.status(200).send(result[0]);

      const result = await Category.update(
        {
          name,
          slug,
          description: description ? description : 'description',
        },
        {
          where: { id: categoryId },
          returning: true,
        }
      );

      if (result[0] === 0) {
        return reply.status(404).send({ error: 'Category not found' });
      }

      return reply.status(200).send(result[1][0]);
    } catch (error) {
      return reply.status(500).send({ error: 'Error updating category: ' + error.message });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const categoryId = (request.params as RequestParams).id;

    if (!categoryId) {
      return reply.status(404).send({ error: 'Category ID is required' });
    }

    const user = await User.findOne({ where: { is_admin: true } });

    if (!user) {
      return reply.status(400).send({ error: 'User is not an admin' });
    }

    // const transaction = await Category.sequelize.transaction();

    try {
      // await Post.update(
      //   { categoryId: null },
      //   { where: { categoryId }, transaction }
      // );

      // const result = await Category.sequelize.query('DELETE FROM categories WHERE id = $1 RETURNING *', {
      //   replacements: [categoryId],
      //   type: Sequelize.QueryTypes.DELETE,
      //   // transaction,
      // });
      const result = await Category.destroy({
        where: { id: categoryId },
      });

      if (result === 0) {
        return reply.status(404).send({ error: 'Category not found' });
      }

      // const result = await Category.findOne({ delete: { categoryId } });

      // if (result[0].length === 0) {
      //   // await transaction.rollback();
      //   return reply.status(404).send({ error: 'Category not found' });
      // }

      // await transaction.commit();

      return reply.status(200).send({ message: 'Category deleted successfully.' });
    } catch (error: any) {
      // await transaction.rollback();
      console.log(error);
      return reply.status(500).send({ error: 'Error deleting category: ' + error.message });
    }
  }
}

export default new CategoryController();
