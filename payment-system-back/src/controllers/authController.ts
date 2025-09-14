import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { AuthRequest } from '../types';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        name: user.name 
      },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      { expiresIn: '24h' }
    );
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const allowedRoles = ['staff', 'manager', 'finance', 'admin'];

export const register = async (req: AuthRequest, res: Response) => {
  try {
     if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only administrators can register users' });
    }

    const { email, password, name, department, role } = req.body;

     if (!email || !password || !name || !role) {
      return res.status(400).json({ message: 'All fields including role are required' });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role selected' });
    }
    
    const emailExists = await UserModel.emailExists(email);
    if (emailExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const user = await UserModel.create({
      email,
      password,
      name,
      role,
      department: department || 'General'
    });
    // const token = jwt.sign(
    //   { 
    //     id: user.id, 
    //     email: user.email, 
    //     role: user.role, 
    //     name: user.name 
    //   },
    //   process.env.JWT_SECRET || 'your-secret-key',
    //   { expiresIn: '24h' }
    // );

    res.status(201).json({
      message: 'User registered successfully',
      user,
      // token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};