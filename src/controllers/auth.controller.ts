import crypto from 'crypto';

import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { FastifyRequest, FastifyReply } from 'fastify';
import jwt, { JwtPayload } from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import { User } from '@app/models/user.model';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Hàm kiểm tra mật khẩu
// function validatePassword(password: string): boolean {
//   const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
//   return regex.test(password);
// }

// Xử lý đăng ký người dùng
export const registerUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { first_name, last_name, email, password } = request.body as any;

  // Kiểm tra mật khẩu
  // if (!validatePassword(password)) {
  //   return reply
  //     .status(400)
  //     .send({ error: 'Mật khẩu phải có từ 8-16 ký tự, bao gồm chữ hoa, chữ thường và ký tự đặc biệt.' });
  // }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return reply.status(400).send({ error: 'Người dùng đã tồn tại' });
    }

    await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      is_verified: false,
      verification_token: verificationToken,
    });

    const verifyUrl = `http://localhost:3000/api/auth/verify-email?token=${verificationToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Xác thực email của bạn',
      html: `<p>Vui lòng xác thực email của bạn bằng cách nhấn vào liên kết này: <a href="${verifyUrl}">${verifyUrl}</a></p>`,
    };

    // Gửi email xác thực
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Lỗi gửi email:', error);
      return reply.status(500).send({ error: 'Gửi email xác thực thất bại' });
    }

    reply.status(201).send({
      message: 'Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác thực.',
    });
  } catch (error) {
    reply.status(500).send({ error: 'Lỗi khi tạo người dùng' });
  }
};

export const testMail = async (request: FastifyRequest, reply: FastifyReply) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'thong.le@tomosia.com', // Email người nhận
    subject: 'Test Email từ Fastify',
    text: 'Nếu bạn nhận được email này, cấu hình SMTP đã hoạt động!',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    reply.code(201).send({ message: 'Email sent successfully!', info });
  } catch (error) {
    console.error('Lỗi gửi email:', error);
    reply.status(500).send({ error: 'Gửi email thất bại', details: error.message });
  }
};

export const verifyEmail = async (request: FastifyRequest, reply: FastifyReply) => {
  const { token } = request.query as any;

  if (!token) {
    return reply.status(400).send({ error: 'Token không hợp lệ' });
  }

  const user = await User.findOne({ where: { verification_token: token } });

  if (!user) {
    return reply.status(400).send({ error: 'Token không hợp lệ hoặc người dùng không tìm thấy' });
  }

  user.is_verified = true;
  user.verification_token = null;
  await user.save();

  reply.status(200).send({ message: 'Email đã được xác thực thành công' });
};
// Đăng nhập người dùng
export const loginUsers = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = request.body as any;

  try {
    // Kiểm tra người dùng có tồn tại không
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return reply.status(400).send({ error: 'Email hoặc mật khẩu không đúng' });
    }

    // Kiểm tra người dùng đã xác thực email chưa
    if (!user.is_verified) {
      return reply.status(400).send({ error: 'Tài khoản chưa được xác thực' });
    }

    // Tạo Access Token
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email }, // Payload
      process.env.JWT_SECRET as string, // Secret (ép kiểu)
      { expiresIn: parseInt(process.env.JWT_EXPIRES_IN as string, 10) } // Options (ép kiểu)
    );
    console.info('User:', user);
    console.info('Access Token:', accessToken);

    // Tạo Refresh Token
    const refreshToken = jwt.sign(
      { userId: user.id }, // Payload
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN as string, 10) }
    );

    console.info('User:', user);
    console.info('Refresh Token:', refreshToken);
    console.info('Generating access token...');

    // Lưu Refresh Token vào cơ sở dữ liệu
    user.refresh_token = refreshToken;
    await user.save();

    // Kiểm tra lại sau khi lưu
    const updatedUser = await User.findOne({ where: { email } }); // Tìm lại người dùng từ cơ sở dữ liệu
    console.info('Updated User:', updatedUser);

    // Kiểm tra nếu refreshToken đã được lưu
    if (updatedUser?.refresh_token === refreshToken) {
      console.log('Refresh token has been saved successfully');
    } else {
      console.log('Failed to save refresh token');
    }

    reply.send({ accessToken, refreshToken });
  } catch (error) {
    console.info(error);
    reply.status(500).send({ error: 'Lỗi đăng nhập' });
  }
};

// Refresh Token
export const refreshToken = async (request: FastifyRequest, reply: FastifyReply) => {
  const { refreshToken } = request.body as any;

  if (!refreshToken) {
    return reply.status(401).send({ error: 'Thiếu refresh token' });
  }

  try {
    // Xác minh refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as any;
    const user = await User.findOne({ where: { id: decoded.userId, refresh_token: refreshToken } });

    if (!user) {
      return reply.status(401).send({ error: 'Refresh token không hợp lệ' });
    }

    // Tạo access token mới
    const accessToken = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET as string, {
      expiresIn: parseInt(process.env.JWT_EXPIRES_IN as string, 10), // Thời gian hết hạn cho access token
    });

    return reply.send({ accessToken });
  } catch (error) {
    console.info(error);
    return reply.status(401).send({ error: 'Refresh token không hợp lệ hoặc đã hết hạn' });
  }
};

export const logoutUsers = async (request: FastifyRequest, reply: FastifyReply) => {
  const { refreshToken } = request.body as any;

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as any;
    const user = await User.findOne({ where: { id: decoded.userId, refresh_token: refreshToken } });

    if (!user) {
      return reply.status(400).send({ error: 'Refresh token không hợp lệ' });
    }

    user.refresh_token = null;
    await user.save();

    reply.send({ message: 'Đăng xuất thành công' });
  } catch (error) {
    reply.status(400).send({ error: 'Lỗi đăng xuất' });
  }
};

export const forgotPassword = async (request: FastifyRequest, reply: FastifyReply) => {
  const { email } = request.body as any;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return reply.status(404).send({ error: 'User not found' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  user.passwordResetToken = token;
  user.passwordResetExpires = Date.now() + 3600000;
  await user.save();

  const resetURl = `http://localhost:3000/api/auth/forgot-password?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Password Reset Request',
    html: `
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetURl}">${resetURl}</a>
  `,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    reply.code(201).send({ message: 'Email sent successfully!', info });
  } catch (error) {
    console.error('Lỗi gửi email:', error);
    reply.status(500).send({ error: 'Email sent fail', details: error.message });
  }
};

interface ResetPasswordQuery {
  token: string;
}

interface ResetPasswordBody {
  password: string;
}

export const resetPassword = async (
  request: FastifyRequest<{ Querystring: ResetPasswordQuery; Body: ResetPasswordBody }>,
  reply: FastifyReply
) => {
  const { token } = request.query;

  if (!token) {
    return reply.status(400).send({ error: 'Token is required' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

    if (!decodedToken || !decodedToken.id) {
      return reply.status(400).send({ error: 'Invalid token' });
    }

    const user = await User.findOne({
      where: {
        id: decodedToken.id,
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() },
      },
    });

    if (!user) {
      return reply.status(404).send({ error: 'Invalid or expired password reset' });
    }
    if (!request.body.password) {
      return reply.status(400).send({ error: 'Password is required' });
    }

    user.password = request.body.password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    await user.save();

    // Send a confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Confirmation',
      html: '<p>Your password has been successfully reset. If you did not initiate this request, please contact us immediately.</p>',
    };

    try {
      await transporter.sendMail(mailOptions);
      reply.send({ message: 'Password reset successful' });
    } catch (err) {
      console.error('Failed to send password reset confirmation email:', err);
      reply.status(500).send({ error: 'Failed to send password reset confirmation email' });
    }
  } catch (error) {
    console.error('Error during password reset:', error);
    return reply.status(500).send({ error: 'Internal server error' });
  }
};
