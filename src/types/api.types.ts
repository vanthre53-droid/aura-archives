/** Standard API envelope returned by every /api/v1 route. */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }

/** Paginated list payload. */
export interface Paginated<T> {
  success: true
  data: T[]
  total: number
  page: number
}

export interface HealthResponse {
  status: 'ok' | 'error'
  db: 'connected' | 'disconnected'
  version: string
}
