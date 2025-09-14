import pool from '../config/database';
import { Approval } from '../types';

export const ApprovalModel = {
  create: async (approval: Omit<Approval, 'id' | 'created_at'>): Promise<Approval> => {
    const { request_id, approver_id, status, comments } = approval;
    const result = await pool.query(
      `INSERT INTO approvals (request_id, approver_id, status, comments) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [request_id, approver_id, status, comments]
    );
    return result.rows[0];
  },

  findByRequestId: async (requestId: string): Promise<Approval[]> => {
    const result = await pool.query(
      `SELECT a.*, u.name as approver_name 
       FROM approvals a 
       LEFT JOIN users u ON a.approver_id = u.id 
       WHERE a.request_id = $1 
       ORDER BY a.created_at`,
      [requestId]
    );
    return result.rows;
  },

  findPendingForManager: async (managerId: string): Promise<any[]> => {
    const result = await pool.query(`
      SELECT pr.*, v.name AS vendor_name, u.name AS user_name, u.email AS user_email
      FROM payment_requests pr
      JOIN vendors v ON pr.vendor_id = v.id
      JOIN users u ON pr.user_id = u.id
      WHERE pr.status = 'pending'
      ORDER BY pr.created_at DESC
    `);
    return result.rows;
  },

  findPendingForFinance: async (financeId: string): Promise<any[]> => {
    const result = await pool.query(`
      SELECT pr.*, v.name AS vendor_name, u.name AS user_name, u.email AS user_email
      FROM payment_requests pr
      JOIN vendors v ON pr.vendor_id = v.id
      JOIN users u ON pr.user_id = u.id
      WHERE pr.status = 'approved'
      ORDER BY pr.created_at DESC
    `);
    return result.rows;
  },

  findPendingForAdmin: async (): Promise<any[]> => {
    const result = await pool.query(`
      SELECT pr.*, v.name AS vendor_name, u.name AS user_name, u.email AS user_email
      FROM payment_requests pr
      JOIN vendors v ON pr.vendor_id = v.id
      JOIN users u ON pr.user_id = u.id
      WHERE pr.status IN ('pending', 'approved')
      ORDER BY 
        CASE 
          WHEN pr.status = 'pending' THEN 1 
          WHEN pr.status = 'approved' THEN 2 
          ELSE 3 
        END,
        pr.created_at DESC
    `);
    return result.rows;
  },
    findAllForAdmin: async (): Promise<any[]> => {
    const result = await pool.query(`
      SELECT pr.*, v.name AS vendor_name, u.name AS user_name, u.email AS user_email
      FROM payment_requests pr
      JOIN vendors v ON pr.vendor_id = v.id
      JOIN users u ON pr.user_id = u.id
      ORDER BY pr.created_at DESC
    `);
    return result.rows;
  }
};