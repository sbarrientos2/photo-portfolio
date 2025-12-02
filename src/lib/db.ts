import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.POSTGRES_URL || process.env.DATABASE_URL!);

let initialized = false;

async function initialize() {
  if (initialized) {
    return;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      cover_image TEXT,
      sort_order INT DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      src TEXT NOT NULL,
      caption TEXT,
      description TEXT,
      sort_order INT DEFAULT 0
    )
  `;

  initialized = true;
}

export async function initDb() {
  await initialize();
}
