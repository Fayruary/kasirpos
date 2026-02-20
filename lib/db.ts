// lib/db.ts
import pkg from 'pg';
const { Pool } = pkg;

export const db = new Pool({
  connectionString: process.env.DATABASE_URL, // dari .env
  ssl: {
    rejectUnauthorized: false, // Supabase butuh SSL
  },
});