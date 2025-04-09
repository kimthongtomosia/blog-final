import { FastifyRequest, FastifyReply } from 'fastify';

import { verifyJWT } from '../utils/jwt.utils';

export const jwtAuth = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Lấy token từ header Authorization

    if (!token) {
      return res.status(401).send({ error: 'Authorization token missing' });
    }

    // Giải mã token và lấy thông tin người dùng
    const decoded = await verifyJWT(token);
    req.user = decoded; // Thêm thông tin người dùng vào request
  } catch (error) {
    return res.status(401).send({ error: 'Invalid or expired token' });
  }
};
