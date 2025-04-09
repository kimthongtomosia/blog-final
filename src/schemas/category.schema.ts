export const CreatCateSchema = {
  schema: {
    description: 'Create a new category',
    tags: ['Category'],
    body: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', description: 'Name of the category' },
        description: { type: 'string', description: 'Description of the category' },
      },
    },
    response: {
      201: {
        description: 'Category created successfully',
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      400: {
        description: 'Invalid request',
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
      500: {
        description: 'Internal server error',
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },
};

export const getCateSchema = {
  schema: {
    summary: 'Get Category',
    description: 'Get All Category',
    tags: ['Category'],
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
      },
      404: { type: 'object', properties: { error: { type: 'string' } } }, // Trả về lỗi khi không tìm thấy
    },
  },
};

export const editCateSchema = {
  schema: {
    description: 'Update category',
    tags: ['Category'],
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'integer', description: 'ID of the category to update' },
      },
    },
    body: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', description: 'Name of the category' },
        description: { type: 'string', description: 'Description of the category' },
      },
    },
    response: {
      201: {
        description: 'Category update successfully',
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      400: {
        description: 'Invalid request',
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
      500: {
        description: 'Internal server error',
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },
};

export const deleteCateSchema = {
  schema: {
    description: 'Delete category',
    tags: ['Category'],
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'integer', description: 'ID of the category to delete' },
      },
    },
    response: {
      201: {
        description: 'Category delete successfully',
        type: 'object',
      },
      400: {
        description: 'Invalid request',
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
      500: {
        description: 'Internal server error',
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },
};
