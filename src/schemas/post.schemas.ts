export const PostSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    title: { type: 'string' },
    slug: { type: 'string' },
    excerpt: { type: 'string' },
    content: { type: 'string' },
    status: { type: 'string', enum: ['draft', 'published'] },
    viewCount: { type: 'integer' },
    userId: { type: 'integer' },
    categoryId: { type: ['integer', 'null'] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    publishedAt: { type: ['string', 'null'], format: 'date-time' },
  },
};

export const CreatePostSchema = {
  type: 'object',
  required: ['title', 'content'],
  properties: {
    title: { type: 'string' },
    content: { type: 'string' },
    excerpt: { type: 'string' },
    categoryId: { type: ['integer', 'null'] },
  },
};

export const UpdatePostSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    content: { type: 'string' },
    excerpt: { type: 'string' },
    categoryId: { type: ['integer', 'null'] },
    status: { type: 'string', enum: ['draft', 'published'] },
  },
};

export const PostQuerySchema = {
  type: 'object',
  properties: {
    page: { type: 'integer', minimum: 1, default: 1 },
    limit: { type: 'integer', minimum: 1, default: 10 },
    categoryId: { type: 'integer' },
    userId: { type: 'integer' },
    status: { type: 'string', enum: ['draft', 'published'] },
  },
};

export const PostSearchQuerySchema = {
  type: 'object',
  required: ['q'],
  properties: {
    q: { type: 'string' },
    page: { type: 'integer', minimum: 1, default: 1 },
    limit: { type: 'integer', minimum: 1, default: 10 },
  },
};

export const PostParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
  },
};

export const PostSlugParamsSchema = {
  type: 'object',
  properties: {
    slug: { type: 'string' },
  },
};

export const PostResponseSchema = {
  200: PostSchema,
  404: {
    type: 'object',
    properties: {
      error: { type: 'string' },
      message: { type: 'string' },
    },
  },
};

export const PostListResponseSchema = {
  200: {
    type: 'object',
    properties: {
      total: { type: 'integer' },
      page: { type: 'integer' },
      limit: { type: 'integer' },
      posts: {
        type: 'array',
        items: PostSchema,
      },
    },
  },
};

export const PostDeleteResponseSchema = {
  204: {},
  403: {
    type: 'object',
    properties: {
      error: { type: 'string' },
      message: { type: 'string' },
    },
  },
  404: {
    type: 'object',
    properties: {
      error: { type: 'string' },
      message: { type: 'string' },
    },
  },
};
