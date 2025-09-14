import { Request, Response } from 'express';
import * as multer from 'multer';
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'staff' | 'manager' | 'finance' | 'admin';
  department: string;
  created_at: Date;
  updated_at: Date;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  contact_info: string;
  bank_account_no: string;
  bank_name: string;
  tax_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentRequest {
  id: string;
  user_id: string;
  vendor_id: string;
  amount: number;
  description: string;
  department: string;
  justification: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected';
  image_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Approval {
  id: string;
  request_id: string;
  approver_id: string;
  status: 'approved' | 'rejected';
  comments: string;
  created_at: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}


export interface AuthRequestWithFile extends AuthRequest {
  file?: Express.Multer.File
}