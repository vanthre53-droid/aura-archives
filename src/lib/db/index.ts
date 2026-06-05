import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@/lib/db/schema'

/**
 * Drizzle client over postgres-js. Server-only.
 *
 * Created lazily on first use so the app boots without DATABASE_URL; calling
 * `getDb()` without it throws a clear error rather than failing at import time.
 * Most user-facing reads go through the Supabase clients (which enforce RLS);
 * use Drizzle for trusted server-side queries and batch operations.
 */
let client: ReturnType<typeof postgres> | null = null
let db: PostgresJsDatabase<typeof schema> | null = null

export function getDb(): PostgresJsDatabase<typeof schema> {
  if (db) return db

  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set — Drizzle client is unavailable.')
  }

  client = postgres(url, { prepare: false })
  db = drizzle(client, { schema })
  return db
}

export { schema }
