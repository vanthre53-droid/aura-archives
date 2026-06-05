import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import type { CartItem, ShippingAddress } from '@/types/shop.types'
import type { OrderStatus, UserRole } from '@/types/database.types'

/**
 * Drizzle schema mirroring supabase/migrations/001_initial_schema.sql.
 * The SQL migrations remain the source of truth; this file gives type-safe
 * queries from server/edge code. Keep the two in sync.
 */

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey(),
    email: text('email').notNull().unique(),
    fullName: text('full_name'),
    phone: text('phone'),
    avatarUrl: text('avatar_url'),
    role: text('role').$type<UserRole>().notNull().default('customer'),
    isVerified: boolean('is_verified').notNull().default(false),
    isBanned: boolean('is_banned').notNull().default(false),
    consentGiven: boolean('consent_given').notNull().default(false),
    consentAt: timestamp('consent_at', { withTimezone: true }),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailIdx: index('idx_users_email').on(t.email),
    roleIdx: index('idx_users_role').on(t.role),
  }),
)

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    imageUrl: text('image_url'),
    sortOrder: integer('sort_order').default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugIdx: index('idx_categories_slug').on(t.slug),
  }),
)

export const products = pgTable(
  'products',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    tagline: text('tagline'),
    description: text('description'),
    details: text('details').array(),
    price: numeric('price', { precision: 12, scale: 2 }).notNull(),
    compareAtPrice: numeric('compare_at_price', { precision: 12, scale: 2 }),
    currency: text('currency').notNull().default('INR'),
    images: text('images').array(),
    sizes: text('sizes').array(),
    tags: text('tags').array(),
    isActive: boolean('is_active').notNull().default(true),
    isFeatured: boolean('is_featured').notNull().default(false),
    stockQuantity: integer('stock_quantity').notNull().default(0),
    sortOrder: integer('sort_order').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    slugIdx: index('idx_products_slug').on(t.slug),
    categoryIdx: index('idx_products_category_id').on(t.categoryId),
    activeIdx: index('idx_products_is_active').on(t.isActive),
    featuredIdx: index('idx_products_is_featured').on(t.isFeatured),
  }),
)

export const wishlist = pgTable(
  'wishlist',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('idx_wishlist_user_id').on(t.userId),
    userProductUnique: uniqueIndex('wishlist_user_id_product_id_key').on(t.userId, t.productId),
  }),
)

export const orders = pgTable(
  'orders',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    status: text('status').$type<OrderStatus>().notNull().default('pending'),
    items: jsonb('items').$type<CartItem[]>().notNull().default(sql`'[]'::jsonb`),
    subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
    customerEmail: text('customer_email').notNull(),
    customerName: text('customer_name').notNull(),
    customerPhone: text('customer_phone'),
    shippingAddress: jsonb('shipping_address').$type<ShippingAddress>(),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('idx_orders_user_id').on(t.userId),
    statusIdx: index('idx_orders_status').on(t.status),
    createdIdx: index('idx_orders_created_at').on(t.createdAt),
  }),
)

export const aiUsageLogs = pgTable(
  'ai_usage_logs',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    sessionId: text('session_id'),
    model: text('model').notNull(),
    feature: text('feature').notNull().default('chat'),
    inputTokens: integer('input_tokens').notNull(),
    outputTokens: integer('output_tokens').notNull(),
    totalTokens: integer('total_tokens').generatedAlwaysAs(
      sql`input_tokens + output_tokens`,
    ),
    costUsd: numeric('cost_usd', { precision: 10, scale: 6 }).notNull(),
    latencyMs: integer('latency_ms'),
    success: boolean('success').notNull().default(true),
    errorMessage: text('error_message'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('idx_ai_usage_user_id').on(t.userId),
    createdIdx: index('idx_ai_usage_created_at').on(t.createdAt),
  }),
)

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    resource: text('resource').notNull(),
    resourceId: text('resource_id'),
    ipAddress: text('ip_address'),
    metadata: jsonb('metadata').default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('idx_audit_logs_user_id').on(t.userId),
    createdIdx: index('idx_audit_logs_created_at').on(t.createdAt),
  }),
)

export type UserRecord = typeof users.$inferSelect
export type ProductRecord = typeof products.$inferSelect
export type CategoryRecord = typeof categories.$inferSelect
export type OrderRecord = typeof orders.$inferSelect
export type WishlistRecord = typeof wishlist.$inferSelect
export type AiUsageLogRecord = typeof aiUsageLogs.$inferSelect
export type AuditLogRecord = typeof auditLogs.$inferSelect
