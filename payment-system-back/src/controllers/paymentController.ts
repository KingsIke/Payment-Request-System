import { Request, Response } from "express";
import { PaymentRequestModel } from '../models/PaymentRequest';
import { ApprovalModel } from '../models/Approval';
import { AuthRequest } from '../types';
import { CloudinaryService } from '../services/cloudinaryService';
import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop() || '');
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and documents are allowed'));
    }
  },
});

export const createPaymentRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    } 
    
    let imageUrl: string | undefined;
    if (req.file) {
      try {
        imageUrl = await CloudinaryService.uploadFromBuffer(req.file.buffer);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ message: 'Failed to upload file' });
      }
    }

    const { vendorId, amount, description, department, justification } = req.body;

    const paymentRequest = await PaymentRequestModel.create({
      user_id: req.user.id,
      vendor_id: vendorId,
      amount,
      description,
      department,
      justification,
      status: 'pending',
      image_url: imageUrl,
    });

    res.status(201).json({ 
      message: 'Payment request created successfully',
      request: paymentRequest
    });
  } catch (error) {
    console.error('Create payment request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPaymentRequests = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const requests = await PaymentRequestModel.findByUserId(req.user.id);
    res.json({ requests });
  } catch (error) {
    console.error('Get payment requests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPaymentRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const request = await PaymentRequestModel.findById(id);

    if (!request) {
      return res.status(404).json({ message: 'Payment request not found' });
    }
    if (req.user && req.user.id !== request.user_id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const approvals = await ApprovalModel.findByRequestId(id);

    res.json({ 
      request: {
        ...request,
        approvals
      } 
    });
  } catch (error) {
    console.error('Get payment request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const stats = await PaymentRequestModel.getDashboardStats(req.user.id);
    const requests = await PaymentRequestModel.findByUserId(req.user.id);

    res.json({
      stats,
      recentRequests: requests.slice(0, 5).map(req => ({
        id: req.id,
         vendorId: req.vendor_id,
        amount: req.amount,
        status: req.status,
        createdAt: req.created_at
      }))
    });
  } catch (error) {
    console.error('Get dashboard data error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};