import express from 'express';
import { 
  createVendor, 
  getVendors, 
  updateVendor, 
  deleteVendor 
} from '../controllers/vendorController';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateRequest, vendorSchema } from '../middleware/validation';

const router = express.Router();

router.post('/', authenticateToken, validateRequest(vendorSchema), createVendor);
router.get('/', authenticateToken, getVendors);
router.put('/:id', authenticateToken, requireRole(['admin']), updateVendor);
router.delete('/:id', authenticateToken, requireRole(['admin']), deleteVendor);

export default router;