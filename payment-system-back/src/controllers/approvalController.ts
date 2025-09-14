
import { Request, Response } from "express";
import { ApprovalModel } from '../models/Approval';
import { PaymentRequestModel } from '../models/PaymentRequest';
import { AuthRequest } from '../types';
import { sendNotificationEmail } from "../util/emailService";

export const getPendingApprovals = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    let approvals;
    if (req.user.role === 'manager') {
      approvals = await ApprovalModel.findPendingForManager(req.user.id);
    } else if (req.user.role === 'finance') {
      approvals = await ApprovalModel.findPendingForFinance(req.user.id);
    } else {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    res.json({ approvals });
  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const processApproval = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const { id } = req.params;
    const { status, comments } = req.body;

    await ApprovalModel.create({
      request_id: id,
      approver_id: req.user.id,
      status,
      comments
    });

    let newStatus;
    if (status === 'rejected') {
      newStatus = 'rejected';
    } else if (req.user.role === 'manager' && status === 'approved') {
      newStatus = 'approved';
    } else if (req.user.role === 'finance' && status === 'approved') {
      newStatus = 'processing';
    } else {
      return res.status(403).json({ message: 'Invalid approval flow' });
    }

    await PaymentRequestModel.updateStatus(id, newStatus);

    const request = await PaymentRequestModel.findById(id);
    const staffEmail = request?.user_email; 
    const role = req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1);
    const message = `
      Your payment request (PR-${id.substring(0, 8)}) has been <strong>${status}</strong> by ${role}.
      <br/><br/>
      Comments: ${comments || 'No comments provided.'}
    `;

    if (staffEmail) {
      await sendNotificationEmail(
        staffEmail,
        `Payment Request ${status}`,
        message
      );
    }

    res.json({ message: `Request ${status} successfully`, status: newStatus });
  } catch (error) {
    console.error('Process approval error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};