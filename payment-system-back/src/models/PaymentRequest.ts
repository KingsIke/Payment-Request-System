import pool from '../config/database';
import { PaymentRequest } from '../types';

export const PaymentRequestModel = {
  create: async (request: Omit<PaymentRequest, 'id' | 'created_at' | 'updated_at'>): Promise<PaymentRequest> => {
    const { user_id, vendor_id, amount, description, department, justification, status, image_url } = request;
    const result = await pool.query(
      `INSERT INTO payment_requests (user_id, vendor_id, amount, description, department, justification, status, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [user_id, vendor_id, amount, description, department, justification, status, image_url || null]
    );
    return result.rows[0];
  },

  findByUserId: async (userId: string): Promise<PaymentRequest[]> => {
    const result = await pool.query(
      `SELECT pr.*, v.name as vendor_name 
       FROM payment_requests pr 
       LEFT JOIN vendors v ON pr.vendor_id = v.id 
       WHERE pr.user_id = $1 
       ORDER BY pr.created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  getDashboardStats: async (userId: string): Promise<{pending: number, approved: number, rejected: number, processing: number}> => {
    const result = await pool.query(
      `SELECT status, COUNT(*) as count 
       FROM payment_requests 
       WHERE user_id = $1 
       GROUP BY status`,
      [userId]
    );
    
    const stats = { pending: 0, approved: 0, rejected: 0, processing: 0 };
    
    result.rows.forEach(row => {
      stats[row.status as keyof typeof stats] = parseInt(row.count);
    });
    
    return stats;
  },
  
 findById: async (id: string) => {
    const result = await pool.query(`
      SELECT pr.*, u.email AS user_email
      FROM payment_requests pr
      JOIN users u ON pr.user_id = u.id
      WHERE pr.id = $1
    `, [id]);

    return result.rows[0];
  },

  updateStatus: async (id: string, status: string) => {
    await pool.query(
      `UPDATE payment_requests SET status = $1 WHERE id = $2`,
      [status, id]
    );
  }

  
};


