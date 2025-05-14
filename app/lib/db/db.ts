import { neon } from '@neondatabase/serverless';

const database_url = process.env.DATABASE_URL;
if (!database_url) {
  throw new Error('Missing ENV var DATABASE_URL');
}
export const sql = neon(database_url);