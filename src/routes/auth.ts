
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2/promise';

import pool from '../config/db';
import { authenticate } from '../middleware/auth';

const router = Router();

// Admin Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Find admin in TiDB
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id, email, password FROM admin_users WHERE email = ? LIMIT 1',
      [email.trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const admin = rows[0];

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Verify JWT secret
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d'
      }
    );

    return res.json({
      token,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

// Verify Admin Token
router.get('/verify', authenticate, (req: Request, res: Response) => {
  return res.json({
    message: 'Token is valid',
    user: (req as any).user
  });
});

export default router;
