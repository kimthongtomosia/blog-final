export const getUserMeSchema = {
  schema: {
    summary: 'Get Current User Profile',
    description: 'Lấy thông tin người dùng hiện tại.',
    tags: ['Users'],
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          first_name: { type: 'string' },
          last_name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          avatar_url: { type: ['string', 'null'] },
          is_active: { type: 'boolean' },
          is_admin: { type: 'boolean' },
          is_verified: { type: 'boolean' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      404: {
        type: 'object',
        properties: { error: { type: 'string' } },
      },
      500: {
        type: 'object',
        properties: { error: { type: 'string' } },
      },
    },
  },
};

export const updateUserMeSchema = {
  schema: {
    summary: 'Update User Profile',
    description: 'Cập nhật thông tin người dùng hiện tại.',
    tags: ['Users'],
    body: {
      type: 'object',
      properties: {
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        avatar_url: { type: ['string', 'null'] },
      },
    },
    response: {
      200: { type: 'object', properties: { message: { type: 'string' } } },
      500: { type: 'object', properties: { error: { type: 'string' } } },
    },
  },
};

export const changePasswordSchema = {
  schema: {
    summary: 'Change User Password',
    description: 'Đổi mật khẩu người dùng hiện tại.',
    tags: ['Users'],
    body: {
      type: 'object',
      required: ['oldPassword', 'newPassword'],
      properties: {
        oldPassword: { type: 'string' },
        newPassword: { type: 'string' },
      },
    },
    response: {
      200: { type: 'object', properties: { message: { type: 'string' } } },
      400: { type: 'object', properties: { error: { type: 'string' } } },
      500: { type: 'object', properties: { error: { type: 'string' } } },
    },
  },
};

export const getUserByIdSchema = {
  schema: {
    summary: 'Get User by ID',
    description: 'Lấy thông tin người dùng theo ID (có thể công khai).',
    tags: ['Users'],
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          first_name: { type: 'string' },
          last_name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          avatar_url: { type: 'string', nullable: true },
          is_active: { type: 'boolean' },
          is_admin: { type: 'boolean' },
          is_verified: { type: 'boolean' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      404: { type: 'object', properties: { error: { type: 'string' } } },
    },
  },
};
