import express from 'express';
import { login, getCurrentUser, register } from '../controllers/authController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateRequest, loginSchema, registerSchema } from '../middleware/validation';

const router = express.Router();

router.post('/login', validateRequest(loginSchema), login);
router.post(
  '/register',
  authenticateToken,
  requireRole(['admin']),
  validateRequest(registerSchema),
  register
);
router.get('/me', authenticateToken, getCurrentUser);

export default router;