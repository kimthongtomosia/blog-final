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
        first_name: {
          type: 'string',
          minLength: 1,
          maxLength: 18,
          description: 'first name greater than 1 and less than 18',
        },
        last_name: {
          type: 'string',
          minLength: 1,
          maxLength: 18,
          description: 'first name greater than 1 and less than 18',
        },
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
    description: 'Change User Password.',
    tags: ['Users'],
    body: {
      type: 'object',
      required: ['old_Password', 'new_Password'],
      properties: {
        old_Password: {
          type: 'string',
        },
        new_Password: {
          type: 'string',
          minLength: 8,
          maxLength: 16,
          pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$',
          description:
            'Password must be 8-16 characters, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        },
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

// update avatar

export const editAvatarSchema = {
  schema: {
    summary: 'Upload Avatar',
    description: 'Upload user avatar.',
    tags: ['Users'],
    headers: {
      type: 'object',
      properties: {
        'Content-Type': {
          type: 'string',
          pattern: '^multipart/form-data',
          description: 'Content type must be multipart/form-data',
        },
      },
      required: ['Content-Type'],
    },
  },
};
