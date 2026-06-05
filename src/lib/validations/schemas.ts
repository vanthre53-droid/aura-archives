import { z } from 'zod'
import { ORDER_STATUSES } from '@/lib/constants'

/** All Zod schemas for the app live here. Add domain schemas (products, orders)
 * in their respective steps. */

export const orderStatusSchema = z.enum(ORDER_STATUSES)

const email = z.string().trim().toLowerCase().email('Enter a valid email address.')
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .max(72, 'Password is too long.')

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required.'),
})
export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Please enter your name.').max(120),
    email,
    password,
    confirmPassword: z.string(),
    consentGiven: z.literal(true, {
      message: 'You must agree to the Privacy Policy to continue.',
    }),
    ageConfirmed: z.literal(true, {
      message: 'You must confirm you are 13 or older.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })
export type RegisterInput = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({ email })
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
  .object({
    password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your name.').max(120),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal('')),
})
export type ProfileInput = z.infer<typeof profileSchema>

export const cartItemSchema = z.object({
  product_id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  qty: z.number().int().positive().max(99),
  size: z.string().nullable(),
  image: z.string().nullable(),
})

export const shippingAddressSchema = z.object({
  line1: z.string().trim().min(3, 'Enter your address.').max(200),
  city: z.string().trim().min(2, 'Enter your city.').max(100),
  state: z.string().trim().min(2, 'Enter your state.').max(100),
  pin: z.string().trim().min(4, 'Enter a valid PIN/ZIP.').max(12),
  country: z.string().trim().min(2).max(60).default('India'),
})

export const createOrderSchema = z.object({
  items: z.array(cartItemSchema).min(1, 'Your bag is empty.'),
  customer_name: z.string().trim().min(2, 'Enter your name.').max(120),
  customer_email: email,
  customer_phone: z.string().trim().max(20).optional().or(z.literal('')),
  shipping_address: shippingAddressSchema,
  notes: z.string().trim().max(500).optional().or(z.literal('')),
})
export type CreateOrderInput = z.infer<typeof createOrderSchema>

export const wishlistToggleSchema = z.object({
  product_id: z.string().uuid('Invalid product id.'),
})
export type WishlistToggleInput = z.infer<typeof wishlistToggleSchema>

/** Admin product create payload. `slug` is derived from `name` when omitted. */
export const createProductSchema = z.object({
  name: z.string().trim().min(2, 'Enter a product name.').max(200),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case.')
    .max(200)
    .optional(),
  category_id: z.string().uuid().nullable().optional(),
  tagline: z.string().trim().max(200).optional().or(z.literal('')),
  description: z.string().trim().max(5000).optional().or(z.literal('')),
  details: z.array(z.string().trim().min(1).max(500)).max(20).optional(),
  price: z.number().nonnegative('Price cannot be negative.'),
  compare_at_price: z.number().nonnegative().nullable().optional(),
  currency: z.string().trim().length(3).default('INR'),
  images: z.array(z.string().url()).max(12).optional(),
  sizes: z.array(z.string().trim().min(1).max(20)).max(20).optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(30).optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  stock_quantity: z.number().int().nonnegative().default(0),
  sort_order: z.number().int().default(0),
})
export type CreateProductInput = z.infer<typeof createProductSchema>

/** Admin product update payload — any subset of the create fields. */
export const updateProductSchema = createProductSchema.partial()
export type UpdateProductInput = z.infer<typeof updateProductSchema>

/** A single turn in the concierge conversation. */
export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1, 'Message cannot be empty.').max(2000, 'Message is too long.'),
})
export type ChatMessage = z.infer<typeof chatMessageSchema>

/** Concierge chat request: the running transcript, oldest first. */
export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1, 'No messages provided.').max(24),
  sessionId: z.string().trim().min(1).max(100).optional(),
})
export type ChatRequestInput = z.infer<typeof chatRequestSchema>
