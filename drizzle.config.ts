import { defineConfig } from 'drizzle-kit'

/**
 * Drizzle Kit configuration. The canonical schema lives in Supabase migrations;
 * src/lib/db/schema.ts mirrors it for type-safe queries from edge/server code.
 */
export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './supabase/migrations/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  verbose: true,
  strict: true,
})
