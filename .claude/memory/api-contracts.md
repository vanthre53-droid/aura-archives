# API Contracts

Base path: `/api/v1`. All responses: `{ success: boolean, data?, error?, ... }`.

- `GET /api/health` → `{ status, db, version }`.
- `GET /api/v1/products` → `{ success, data: Product[], total, page }`. Public, 60/min/IP.
- `POST /api/v1/products` → admin only, 30/min. Body: CreateProductSchema.
- `PUT /api/v1/products/[id]` → admin only. Partial CreateProductSchema.
- `DELETE /api/v1/products/[id]` → admin only. Soft delete (is_active=false).
- `POST /api/v1/wishlist` → auth. Body `{ product_id }` → `{ success, action }`.
- `POST /api/v1/orders` → auth, 5/hr. Body: order payload → creates order + email.
- `POST /api/ai/chat` → Edge, streaming, 20/hr/IP. Logs to ai_usage_logs.
