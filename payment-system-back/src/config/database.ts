import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
console.log('DB URL:', process.env.SUPABASE_DB_URL);
const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on('connect', () => {
  console.log('✅ Connected to Supabase PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

export default pool;