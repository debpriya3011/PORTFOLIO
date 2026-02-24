import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Promisified helpers (same pattern as your SQLite)
const run = async (sql: string, params: any[] = []) => {
  const result = await pool.query(sql, params);
  return result;
};

const get = async (sql: string, params: any[] = []) => {
  const result = await pool.query(sql, params);
  return result.rows[0];
};

const all = async (sql: string, params: any[] = []) => {
  const result = await pool.query(sql, params);
  return result.rows;
};

export default pool;
export { run, get, all };