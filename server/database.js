import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Create PostgreSQL pool (Neon)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  statement_timeout: 30000,
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Helper methods (same API style as before)
const run = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return {
    id: result.rows?.[0]?.id || null,
    changes: result.rowCount,
  };
};

const get = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return result.rows[0];
};

const all = async (sql, params = []) => {
  const result = await pool.query(sql, params);
  return result.rows;
};

// Initialize database tables
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        otp TEXT,
        otp_expires BIGINT,
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        linkedin_url TEXT NOT NULL,
        author_name TEXT,
        author_image TEXT,
        content TEXT,
        images TEXT,
        likes INTEGER DEFAULT 0,
        comments INTEGER DEFAULT 0,
        comments_data TEXT,
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        sources TEXT,
        display_order INTEGER DEFAULT 0,
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS experience (
        id SERIAL PRIMARY KEY,
        company TEXT NOT NULL,
        role TEXT NOT NULL,
        type TEXT,
        location TEXT,
        start_date TEXT,
        end_date TEXT,
        description TEXT,
        skills TEXT,
        display_order INTEGER DEFAULT 0,
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS education (
        id SERIAL PRIMARY KEY,
        institution TEXT NOT NULL,
        degree TEXT,
        field_of_study TEXT,
        start_date TEXT,
        end_date TEXT,
        grade TEXT,
        skills TEXT,
        display_order INTEGER DEFAULT 0,
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS certifications (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        issuer TEXT,
        issue_date TEXT,
        expiry_date TEXT,
        credential_id TEXT,
        credential_url TEXT,
        skills TEXT,
        display_order INTEGER DEFAULT 0,
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        filename TEXT NOT NULL,
        url TEXT NOT NULL,
        alt TEXT,
        category TEXT,
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS workflows (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        nodes TEXT,
        edges TEXT,
        display_order INTEGER DEFAULT 0,
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())
      );
    `);

    // Insert default admin safely
    await pool.query(`
      INSERT INTO users (email)
      VALUES ('debpriya3011@gmail.com')
      ON CONFLICT (email) DO NOTHING;
    `);

    console.log("Database initialized successfully (PostgreSQL)");
  } catch (err) {
    console.error("Database initialization error:", err);
  }
};

// Initialize on startup
initDB();

export default pool;
export { run, get, all };