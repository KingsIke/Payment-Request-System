import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details 
      });
    }
    next();
  };
};
const allowedRoles = ['staff', 'manager', 'finance', 'admin'];

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match'
  }),
  name: Joi.string().min(2).required(),
  department: Joi.string().min(2).optional(),
    role: Joi.string().valid(...allowedRoles).required()
});

export const paymentRequestSchema = Joi.object({
  vendorId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().required(),
  department: Joi.string().required(),
  justification: Joi.string().required(),
});

export const vendorSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  contactInfo: Joi.string().min(5).required(),
  bankAccountNo: Joi.string().min(5).required(),
  bankName: Joi.string().min(2).required(),
  taxId: Joi.string().min(2).required(),
});

export const approvalSchema = Joi.object({
  status: Joi.string().valid('approved', 'rejected').required(),
  comments: Joi.string().min(5).required(),
});