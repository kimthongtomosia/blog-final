import bcrypt from 'bcryptjs';
import { FastifyReply, FastifyRequest } from 'fastify';

import { User } from '../models/user.model';

export const getUserMe = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = await User.findByPk((request.user as any).id, {
      attributes: [
        'id',
        'first_name',
        'last_name',
        'email',
        'avatar_url',
        'is_active',
        'is_admin',
        'is_verified',
        'created_at',
        'updated_at',
      ],
      raw: true,
    });

    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    const response = {
      ...user,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    };

    reply.send(response);
  } catch (error) {
    console.error('Error in getMe:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const updateUserMe = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await User.update(request.body, { where: { id: (request.user as any).id } });
    reply.send({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error in updateMe:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const changePassword = async (request: FastifyRequest, reply: FastifyReply) => {
  const { oldPassword, newPassword } = request.body as any;

  try {
    const user = await User.findByPk((request.user as any).id);
    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      return reply.status(400).send({ error: 'Invalid old password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { id: (request.user as any).id } });

    reply.send({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error in changePassword:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};

export const getUserById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = await User.findByPk((request.params as any).id);

    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    reply.send(user);
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
};
