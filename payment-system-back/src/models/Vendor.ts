import pool from '../config/database';
import { Vendor } from '../types';

export const VendorModel = {
  create: async (vendor: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>): Promise<Vendor> => {
    const { name, email, contact_info, bank_account_no, bank_name, tax_id } = vendor;
    const result = await pool.query(
      `INSERT INTO vendors (name, email, contact_info, bank_account_no, bank_name, tax_id) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, email, contact_info, bank_account_no, bank_name, tax_id]
    );
    return result.rows[0];
  },

  findAll: async (): Promise<Vendor[]> => {
    const result = await pool.query(
      'SELECT * FROM vendors ORDER BY name'
    );
    return result.rows;
  },

  findById: async (id: string): Promise<Vendor | null> => {
    const result = await pool.query(
      'SELECT * FROM vendors WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },
  update: async (id: string, vendor: Partial<Vendor>): Promise<Vendor> => {
    const { name, email, contact_info, bank_account_no, bank_name, tax_id } = vendor;
    const result = await pool.query(
      `UPDATE vendors 
       SET name = COALESCE($1, name), 
           email = COALESCE($2, email), 
           contact_info = COALESCE($3, contact_info), 
           bank_account_no = COALESCE($4, bank_account_no), 
           bank_name = COALESCE($5, bank_name), 
           tax_id = COALESCE($6, tax_id),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 
       RETURNING *`,
      [name, email, contact_info, bank_account_no, bank_name, tax_id, id]
    );
    return result.rows[0];
  },

  delete: async (id: string): Promise<void> => {
    await pool.query(
      'DELETE FROM vendors WHERE id = $1',
      [id]
    );
  },
};