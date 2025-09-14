import pool from '../config/database';
import { User } from '../types';
import bcrypt from 'bcryptjs';

export const UserModel = {
  findByEmail: async (email: string): Promise<User | null> => {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  },
  findById: async (id: string): Promise<User | null> => {
    const result = await pool.query(
      'SELECT id, email, name, role, department, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  create: async (user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> => {
    const { email, password, name, role, department } = user;
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const result = await pool.query(
      `INSERT INTO users (email, password, name, role, department) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, email, name, role, department, created_at, updated_at`,
      [email, hashedPassword, name, role, department]
    );
    return result.rows[0];
  },
  emailExists: async (email: string): Promise<boolean> => {
    const result = await pool.query(
      'SELECT COUNT(*) FROM users WHERE email = $1',
      [email]
    );
    return parseInt(result.rows[0].count) > 0;
  },
};