export const registerUserSchema = {
  schema: {
    summary: 'Sign up for an account',
    description: 'Create a new account with email and password.',
    tags: ['Auth'],
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        email: { type: 'string' },
        password: {
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
      201: {
        type: 'object',
        properties: { message: { type: 'string' } },
      },
      400: { type: 'object', properties: { error: { type: 'string' } } },
    },
  },
};

export const loginUserSchema = {
  schema: {
    summary: 'LogIn',
    description: 'User enters email and password to receive authentication token.',
    tags: ['Auth'],
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8 },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
        },
      },
      401: { type: 'object', properties: { error: { type: 'string' } } },
    },
  },
};

export const refreshTokenSchema = {
  schema: {
    summary: 'Refresh Token',
    description: 'Use refresh token to get new access token.',
    tags: ['Auth'],
    body: {
      type: 'object',
      required: ['refreshToken'],
      properties: {
        refreshToken: { type: 'string' },
      },
    },
    response: {
      200: { type: 'object', properties: { accessToken: { type: 'string' } } },
      401: { type: 'object', properties: { error: { type: 'string' } } },
    },
  },
};

export const logoutUserSchema = {
  schema: {
    summary: 'Logout',
    description: 'Delete refresh token from system to log out.',
    tags: ['Auth'],
    body: {
      type: 'object',
      required: ['refreshToken'],
      properties: {
        refreshToken: { type: 'string' },
      },
    },
    response: {
      200: { type: 'object', properties: { message: { type: 'string' } } },
      400: { type: 'object', properties: { error: { type: 'string' } } },
    },
  },
};

export const verifyEmailSchema = {
  schema: {
    summary: 'Email Verification',
    description: 'The user clicks on the email verification link sent via email.',
    tags: ['Email'],
    querystring: {
      type: 'object',
      required: ['token'],
      properties: {
        token: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: { message: { type: 'string' } },
      },
      400: { type: 'object', properties: { error: { type: 'string' } } },
    },
  },
};

export const testMailSchema = {
  schema: {
    summary: 'Send Test Email',
    description: 'Test your SMTP email configuration by sending a test email.',
    tags: ['Email'],
    response: {
      201: { type: 'object', properties: { message: { type: 'string' } } },
      500: { type: 'object', properties: { error: { type: 'string' } } },
    },
  },
};

export const forgotPasswordSchema = {
  schema: {
    summary: 'Forgot Password',
    description: 'User requests password reset link via email.',
    tags: ['Auth'],
    body: {
      type: 'object',
      required: ['email'],
      properties: {
        email: { type: 'string', format: 'email' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      400: { type: 'object', properties: { error: { type: 'string' } } },
    },
  },
};
export const resetPasswordSchema = {
  schema: {
    summary: 'Reset Password',
    description: 'Reset user password with token and new password.',
    tags: ['Auth'],
    querystring: {
      type: 'object',
      required: ['token'],
      properties: {
        token: { type: 'string' },
      },
    },
    body: {
      type: 'object',
      required: ['password'],
      properties: {
        password: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      400: { type: 'object', properties: { error: { type: 'string' } } },
      404: { type: 'object', properties: { error: { type: 'string' } } },
      500: { type: 'object', properties: { error: { type: 'string' } } },
    },
  },
};
