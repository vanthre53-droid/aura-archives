/**
 * Supabase database types.
 *
 * This file is hand-authored to mirror supabase/migrations and is meant to be
 * regenerated once a project is linked:
 *   supabase gen types typescript --project-id <id> > src/types/database.types.ts
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type UserRole = 'customer' | 'admin'
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: UserRole
          is_verified: boolean
          is_banned: boolean
          consent_given: boolean
          consent_at: string | null
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: UserRole
          is_verified?: boolean
          is_banned?: boolean
          consent_given?: boolean
          consent_at?: string | null
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['users']['Insert']>
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          sort_order: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          sort_order?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
        Relationships: []
      }
      products: {
        Row: {
          id: string
          category_id: string | null
          name: string
          slug: string
          tagline: string | null
          description: string | null
          details: string[] | null
          price: number
          compare_at_price: number | null
          currency: string
          images: string[] | null
          sizes: string[] | null
          tags: string[] | null
          is_active: boolean
          is_featured: boolean
          stock_quantity: number
          sort_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          slug: string
          tagline?: string | null
          description?: string | null
          details?: string[] | null
          price: number
          compare_at_price?: number | null
          currency?: string
          images?: string[] | null
          sizes?: string[] | null
          tags?: string[] | null
          is_active?: boolean
          is_featured?: boolean
          stock_quantity?: number
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['products']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey'
            columns: ['category_id']
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
      }
      wishlist: {
        Row: { id: string; user_id: string; product_id: string; created_at: string }
        Insert: { id?: string; user_id: string; product_id: string; created_at?: string }
        Update: Partial<Database['public']['Tables']['wishlist']['Insert']>
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: OrderStatus
          items: Json
          subtotal: number
          customer_email: string
          customer_name: string
          customer_phone: string | null
          shipping_address: Json | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: OrderStatus
          items?: Json
          subtotal: number
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          shipping_address?: Json | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
        Relationships: []
      }
      ai_usage_logs: {
        Row: {
          id: string
          user_id: string | null
          session_id: string | null
          model: string
          feature: string
          input_tokens: number
          output_tokens: number
          total_tokens: number
          cost_usd: number
          latency_ms: number | null
          success: boolean
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          model: string
          feature?: string
          input_tokens: number
          output_tokens: number
          cost_usd: number
          latency_ms?: number | null
          success?: boolean
          error_message?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['ai_usage_logs']['Insert']>
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          resource: string
          resource_id: string | null
          ip_address: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          resource: string
          resource_id?: string | null
          ip_address?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: { user_role: UserRole; order_status: OrderStatus }
    CompositeTypes: Record<string, never>
  }
}
