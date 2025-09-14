import express from 'express';
import { 
  createPaymentRequest, 
  getPaymentRequests, 
  getPaymentRequest, 
  getDashboardData, 
  upload
} from '../controllers/paymentController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, paymentRequestSchema } from '../middleware/validation';

const router = express.Router();

router.post('/', authenticateToken,upload.single('paymentImage'), validateRequest(paymentRequestSchema), createPaymentRequest);
router.get('/', authenticateToken, getPaymentRequests);
router.get('/dashboard', authenticateToken, getDashboardData);
router.get('/:id', authenticateToken, getPaymentRequest);

export default router;