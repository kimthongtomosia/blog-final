import fs from 'fs/promises';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import path from 'path';

import bcrypt from 'bcryptjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../models/user.model';

const AVATAR_UPLOAD_DIR = path.join(__dirname, '../../uploads/avatars');

class UserController {
  async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any).userId;
      console.log(`Attempting to find user with ID: ${userId}`);

      const user = await User.findByPk(userId, {
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
        // raw: true,
      });

      if (!user) {
        console.info(`User with ID ${userId} not found.`);
        return reply.status(404).send({ error: `User with ID ${userId} not found` });
      }

      const response = {
        ...user,
        created_at: user.created_at.toISOString(),
        updated_at: user.updated_at.toISOString(),
      };

      reply.send(response);
    } catch (error) {
      console.error('Error in getMe:', error);
      reply.status(500).send({ error: 'Internal Server Error', details: error.message });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any).userId;
      await User.update(request.body, { where: { id: userId } });
      reply.send({ message: 'User updated successfully' });
    } catch (error) {
      console.error('Error in updateMe:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  }

  async changePassword(request: FastifyRequest, reply: FastifyReply) {
    const { oldPassword, newPassword } = request.body as any;

    try {
      const userId = (request.user as any).userId;
      const user = await User.findByPk(userId);
      if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
        return reply.status(400).send({ error: 'Invalid old password' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.update({ password: hashedPassword }, { where: { id: userId } });

      reply.send({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error in changePassword:', error);
      reply.status(500).send({ error: 'Internal Server Error' });
    }
  }

  async show(request: FastifyRequest, reply: FastifyReply) {
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
  }
  // update avatar
  async editAvatar(request: FastifyRequest, reply: FastifyReply) {
    try {
      console.info('Content-Type:', request.headers['content-type']);

      const userId = (request.user as any).userId;
      const data = await request.file();
      console.info('File Data:', data);

      if (!data) {
        return reply.status(400).send({ error: 'No file uploaded' });
      }

      const { filename, mimetype, file } = data;

      if (!mimetype.startsWith('image/')) {
        file.resume();
        return reply.status(400).send({ error: 'Only image files are allowed' });
      }

      // Tạo tên tệp duy nhất
      const fileExtension = filename.split('.').pop();
      const newFilename = `${uuidv4()}.${fileExtension}`;
      const destinationPath = path.join(AVATAR_UPLOAD_DIR, newFilename);

      // Tạo thư mục tải lên nếu nó chưa tồn tại
      await fs.mkdir(AVATAR_UPLOAD_DIR, { recursive: true });

      try {
        await pipeline(file, createWriteStream(destinationPath));
      } catch (error) {
        console.error('Error writing file to disk:', error);
        return reply.status(500).send({ error: 'Failed to save file' });
      }

      // Cập nhật avatar_url trong cơ sở dữ liệu
      const avatarUrl = `/uploads/avatars/${newFilename}`; // Đường dẫn tương đối

      const [updatedRows] = await User.update({ avatar_url: avatarUrl }, { where: { id: userId } });

      if (updatedRows > 0) {
        return reply.send({ message: 'Avatar uploaded successfully', avatar_url: avatarUrl });
      } else {
        // Xóa tệp đã tải lên nếu không cập nhật được cơ sở dữ liệu
        await fs.unlink(destinationPath);
        return reply.status(500).send({ error: 'Failed to update avatar URL in database' });
      }
    } catch (error) {
      console.info('Error uploading avatar:', error);
      return reply.status(500).send({ error: 'Failed to upload avatar', details: error.message });
    }
  }
}

export default new UserController();
