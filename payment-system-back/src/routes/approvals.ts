import express, { Request, Response, NextFunction } from 'express';
import { 
  getPendingApprovals, 
  processApproval 
} from '../controllers/approvalController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateRequest, approvalSchema } from '../middleware/validation';

const router = express.Router();

router.get('/', authenticateToken, requireRole(['manager', 'finance']), getPendingApprovals);
router.post('/:id', authenticateToken, requireRole(['manager', 'finance']), validateRequest(approvalSchema), processApproval);

export default router;