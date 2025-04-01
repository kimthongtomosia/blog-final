// import { FastifyInstance } from 'fastify';

// import Post from '@app/models/post.model';
// import {
//   PostSchema,
//   // CreatePostSchema,
//   // UpdatePostSchema,
//   PostQuerySchema,
//   PostSearchQuerySchema,
//   // PostParamsSchema,
//   PostSlugParamsSchema,
//   // PostResponseSchema,
//   PostListResponseSchema,
//   // PostDeleteResponseSchema,
//   ErrorResponseSchema,
// } from '@app/schemas/post.schemas';

// export default async function PostRoutes(fastify: FastifyInstance) {
//   // Get paginated posts
//   fastify.get(
//     '/',
//     {
//       schema: {
//         description: 'Get paginated posts with filtering options',
//         tags: ['Post'],
//         querystring: PostQuerySchema,
//         response: {
//           200: PostListResponseSchema,
//           500: ErrorResponseSchema,
//         },
//       },
//     },
//     async (request, reply) => {
//       try {
//         const {
//           page = 1,
//           limit = 10,
//           ...filters
//         } = request.query as {
//           page?: number;
//           limit?: number;
//           categoryId?: number;
//           userId?: number;
//           status?: string;
//         };

//         const offset = (page - 1) * limit;
//         const where = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== undefined));

//         const { count, rows } = await Post.findAndCountAll({
//           where,
//           limit,
//           offset,
//           order: [['createdAt', 'DESC']],
//         });

//         return {
//           total: count,
//           page,
//           limit,
//           posts: rows,
//         };
//       } catch (error) {
//         fastify.log.error('Failed to fetch posts:', error);
//         return reply.status(500).send({
//           error: 'Internal Server Error',
//           message: 'Failed to fetch posts',
//         });
//       }
//     }
//   );

//   // Search posts
//   fastify.get(
//     '/search',
//     {
//       schema: {
//         description: 'Search posts with full-text search',
//         tags: ['Post'],
//         querystring: PostSearchQuerySchema,
//         response: {
//           200: PostListResponseSchema,
//           500: ErrorResponseSchema,
//         },
//       },
//     },
//     async (request, reply) => {
//       try {
//         const {
//           q,
//           page = 1,
//           limit = 10,
//         } = request.query as {
//           q: string;
//           page?: number;
//           limit?: number;
//         };

//         const offset = (page - 1) * limit;

//         const { count, rows } = await Post.findAndCountAll({
//           where: {
//             [fastify.sequelize.Op.or]: [
//               { title: { [fastify.sequelize.Op.iLike]: `%${q}%` } },
//               { content: { [fastify.sequelize.Op.iLike]: `%${q}%` } },
//             ],
//           },
//           limit,
//           offset,
//           order: [['createdAt', 'DESC']],
//         });

//         return {
//           total: count,
//           page,
//           limit,
//           posts: rows,
//         };
//       } catch (error) {
//         fastify.log.error('Failed to search posts:', error);
//         return reply.status(500).send({
//           error: 'Internal Server Error',
//           message: 'Failed to search posts',
//         });
//       }
//     }
//   );

//   // Get post by slug
//   fastify.get(
//     '/:slug',
//     {
//       schema: {
//         description: 'Get post details by slug',
//         tags: ['Post'],
//         params: PostSlugParamsSchema,
//         response: {
//           200: PostSchema,
//           404: ErrorResponseSchema,
//           500: ErrorResponseSchema,
//         },
//       },
//     },
//     async (request, reply) => {
//       try {
//         const { slug } = request.params as { slug: string };
//         const post = await Post.findOne({ where: { slug } });

//         if (!post) {
//           return reply.status(404).send({
//             error: 'Not Found',
//             message: 'Post not found',
//           });
//         }

//         await post.increment('viewCount');
//         return post;
//       } catch (error) {
//         fastify.log.error('Failed to fetch post:', error);
//         return reply.status(500).send({
//           error: 'Internal Server Error',
//           message: 'Failed to fetch post',
//         });
//       }
//     }
//   );

//   // Create post
//   // fastify.post(
//   //   '/',
//   //   {
//   //     preValidation: [fastify.authenticate],
//   //     schema: {
//   //       description: 'Create a new post (requires authentication)',
//   //       tags: ['Post'],
//   //       body: CreatePostSchema,
//   //       response: {
//   //         201: PostSchema,
//   //         400: ErrorResponseSchema,
//   //         401: ErrorResponseSchema,
//   //         500: ErrorResponseSchema,
//   //       },
//   //     },
//   //   },
//   //   async (request, reply) => {
//   //     try {
//   //       const { title, content, excerpt, categoryId } = request.body as {
//   //         title: string;
//   //         content: string;
//   //         excerpt?: string;
//   //         categoryId?: number;
//   //       };
//   //       const userId = (request.user as any).id;

//   //       const slug = generateSlug(title);
//   //       const generatedExcerpt = excerpt || content.substring(0, 200);

//   //       const post = await Post.create({
//   //         title,
//   //         slug,
//   //         content,
//   //         excerpt: generatedExcerpt,
//   //         userId,
//   //         categoryId,
//   //         status: 'draft',
//   //         viewCount: 0,
//   //       });

//   //       return reply.status(201).send(post);
//   //     } catch (error) {
//   //       fastify.log.error('Failed to create post:', error);
//   //       return reply.status(500).send({
//   //         error: 'Internal Server Error',
//   //         message: 'Failed to create post',
//   //       });
//   //     }
//   //   }
//   // );

//   // Update post
//   // fastify.put(
//   //   '/:id',
//   //   {
//   //     preValidation: [fastify.authenticate],
//   //     schema: {
//   //       description: 'Update a post (only author or admin)',
//   //       tags: ['Post'],
//   //       params: PostParamsSchema,
//   //       body: UpdatePostSchema,
//   //       response: {
//   //         200: PostSchema,
//   //         403: ErrorResponseSchema,
//   //         404: ErrorResponseSchema,
//   //         500: ErrorResponseSchema,
//   //       },
//   //     },
//   //   },
//   //   async (request, reply) => {
//   //     try {
//   //       const { id } = request.params as { id: number };
//   //       const userId = (request.user as any).id;
//   //       const isAdmin = (request.user as any).role === 'admin';

//   //       const post = await Post.findByPk(id);
//   //       if (!post) {
//   //         return reply.status(404).send({
//   //           error: 'Not Found',
//   //           message: 'Post not found',
//   //         });
//   //       }

//   //       if (post.userId !== userId && !isAdmin) {
//   //         return reply.status(403).send({
//   //           error: 'Forbidden',
//   //           message: 'Unauthorized to update this post',
//   //         });
//   //       }

//   //       const { title, ...updateData } = request.body as {
//   //         title?: string;
//   //         [key: string]: any;
//   //       };

//   //       if (title) {
//   //         post.title = title;
//   //         post.slug = generateSlug(title);
//   //       }

//   //       Object.assign(post, updateData);
//   //       await post.save();

//   //       return post;
//   //     } catch (error) {
//   //       fastify.log.error('Failed to update post:', error);
//   //       return reply.status(500).send({
//   //         error: 'Internal Server Error',
//   //         message: 'Failed to update post',
//   //       });
//   //     }
//   //   }
//   // );

//   // Delete post
//   // fastify.delete(
//   //   '/:id',
//   //   {
//   //     preValidation: [fastify.authenticate],
//   //     schema: {
//   //       description: 'Delete a post (only author or admin)',
//   //       tags: ['Post'],
//   //       params: PostParamsSchema,
//   //       response: {
//   //         204: { type: 'null' },
//   //         403: ErrorResponseSchema,
//   //         404: ErrorResponseSchema,
//   //         500: ErrorResponseSchema,
//   //       },
//   //     },
//   //   },
//   //   async (request, reply) => {
//   //     try {
//   //       const { id } = request.params as { id: number };
//   //       const userId = (request.user as any).id;
//   //       const isAdmin = (request.user as any).role === 'admin';

//   //       const post = await Post.findByPk(id);
//   //       if (!post) {
//   //         return reply.status(404).send({
//   //           error: 'Not Found',
//   //           message: 'Post not found',
//   //         });
//   //       }

//   //       if (post.userId !== userId && !isAdmin) {
//   //         return reply.status(403).send({
//   //           error: 'Forbidden',
//   //           message: 'Unauthorized to delete this post',
//   //         });
//   //       }

//   //       await post.destroy();
//   //       return reply.status(204).send();
//   //     } catch (error) {
//   //       fastify.log.error('Failed to delete post:', error);
//   //       return reply.status(500).send({
//   //         error: 'Internal Server Error',
//   //         message: 'Failed to delete post',
//   //       });
//   //     }
//   //   }
//   // );

//   // Publish post
//   // fastify.patch(
//   //   '/:id/publish',
//   //   {
//   //     preValidation: [fastify.authenticate],
//   //     schema: {
//   //       description: 'Publish a post (only author or admin)',
//   //       tags: ['Post'],
//   //       params: PostParamsSchema,
//   //       response: {
//   //         200: PostSchema,
//   //         403: ErrorResponseSchema,
//   //         404: ErrorResponseSchema,
//   //         500: ErrorResponseSchema,
//   //       },
//   //     },
//   //   },
//   //   async (request, reply) => {
//   //     try {
//   //       const { id } = request.params as { id: number };
//   //       const userId = (request.user as any).id;
//   //       const isAdmin = (request.user as any).role === 'admin';

//   //       const post = await Post.findByPk(id);
//   //       if (!post) {
//   //         return reply.status(404).send({
//   //           error: 'Not Found',
//   //           message: 'Post not found',
//   //         });
//   //       }

//   //       if (post.userId !== userId && !isAdmin) {
//   //         return reply.status(403).send({
//   //           error: 'Forbidden',
//   //           message: 'Unauthorized to publish this post',
//   //         });
//   //       }

//   //       post.status = 'published';
//   //       post.publishedAt = new Date();
//   //       await post.save();

//   //       return post;
//   //     } catch (error) {
//   //       fastify.log.error('Failed to publish post:', error);
//   //       return reply.status(500).send({
//   //         error: 'Internal Server Error',
//   //         message: 'Failed to publish post',
//   //       });
//   //     }
//   //   }
//   // );

//   // Unpublish post
//   // fastify.patch(
//   //   '/:id/unpublish',
//   //   {
//   //     preValidation: [fastify.authenticate],
//   //     schema: {
//   //       description: 'Unpublish a post (only author or admin)',
//   //       tags: ['Post'],
//   //       params: PostParamsSchema,
//   //       response: {
//   //         200: PostSchema,
//   //         403: ErrorResponseSchema,
//   //         404: ErrorResponseSchema,
//   //         500: ErrorResponseSchema,
//   //       },
//   //     },
//   //   },
//   //   async (request, reply) => {
//   //     try {
//   //       const { id } = request.params as { id: number };
//   //       const userId = (request.user as any).id;
//   //       const isAdmin = (request.user as any).role === 'admin';

//   //       const post = await Post.findByPk(id);
//   //       if (!post) {
//   //         return reply.status(404).send({
//   //           error: 'Not Found',
//   //           message: 'Post not found',
//   //         });
//   //       }

//   //       if (post.userId !== userId && !isAdmin) {
//   //         return reply.status(403).send({
//   //           error: 'Forbidden',
//   //           message: 'Unauthorized to unpublish this post',
//   //         });
//   //       }

//   //       post.status = 'draft';
//   //       post.publishedAt = null;
//   //       await post.save();

//   //       return post;
//   //     } catch (error) {
//   //       fastify.log.error('Failed to unpublish post:', error);
//   //       return reply.status(500).send({
//   //         error: 'Internal Server Error',
//   //         message: 'Failed to unpublish post',
//   //       });
//   //     }
//   //   }
//   // );
// }

// // Helper function to generate slug
// function generateSlug(title: string): string {
//   return title
//     .toLowerCase()
//     .replace(/ /g, '-')
//     .replace(/[^\w-]+/g, '');
// }
