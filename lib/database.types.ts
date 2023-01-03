export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      commitment: {
        Row: {
          created_at: string | null
          description: string | null
          end_at: string | null
          id: number
          start_at: string
          status: number
          tenent_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_at?: string | null
          id?: number
          start_at: string
          status?: number
          tenent_id: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_at?: string | null
          id?: number
          start_at?: string
          status?: number
          tenent_id?: string
          title?: string
        }
      }
      profile: {
        Row: {
          created_at: string | null
          id: number
          level: number
          status: number
          tenent_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          level?: number
          status?: number
          tenent_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          level?: number
          status?: number
          tenent_id?: string | null
          user_id?: string
        }
      }
      tenent: {
        Row: {
          created_at: string | null
          id: string
          name: string
          status: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          status?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          status?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
