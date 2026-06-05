# API Reference

All `/api/v1` responses use the envelope `{ success, data | error }`. Every route runs:
rate limit → auth check → Zod validation → business logic → audit log.

## Health
`GET /api/health` → `{ status, db, version }`.

## Products
- `GET /api/v1/products` — public, 60/min/IP. Query: `category`, `tags`, `featured`,
  `page`, `limit` (≤ 50). → `{ success, data: Product[], total, page }`.
- `POST /api/v1/products` — admin, 30/min. Body: CreateProductSchema.
- `PUT /api/v1/products/[id]` — admin. Partial CreateProductSchema.
- `DELETE /api/v1/products/[id]` — admin. Soft delete (`is_active = false`).

## Wishlist
- `POST /api/v1/wishlist` — auth. Body `{ product_id }`. → `{ success, action: 'added' | 'removed' }`.

## Orders
- `POST /api/v1/orders` — auth, 5/hr. Body: items + customer + shipping. Creates an order
  and triggers the confirmation email.

## AI
- `POST /api/ai/chat` — Edge runtime, streaming, 20/hr/IP. Logs token usage + cost to
  `ai_usage_logs`.

> Routes are implemented in Steps 06–08; this document is the contract they fulfill.
