export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName: string
          query: string
          variables: Json
          extensions: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      billing: {
        Row: {
          commitment_id: string
          created_at: string | null
          description: string
          id: string
          price: number
          remote: boolean
          status: number
        }
        Insert: {
          commitment_id: string
          created_at?: string | null
          description: string
          id?: string
          price?: number
          remote?: boolean
          status?: number
        }
        Update: {
          commitment_id?: string
          created_at?: string | null
          description?: string
          id?: string
          price?: number
          remote?: boolean
          status?: number
        }
      }
      commitment: {
        Row: {
          created_at: string | null
          currency: string
          description: string | null
          end_at: string | null
          id: string
          start_at: string
          status: number
          tenent_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          currency?: string
          description?: string | null
          end_at?: string | null
          id?: string
          start_at: string
          status?: number
          tenent_id: string
          title: string
        }
        Update: {
          created_at?: string | null
          currency?: string
          description?: string | null
          end_at?: string | null
          id?: string
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
      ticket: {
        Row: {
          billing_id: string
          commitment_id: string
          created_at: string | null
          id: number
          owner_id: string | null
          status: number
        }
        Insert: {
          billing_id: string
          commitment_id: string
          created_at?: string | null
          id?: number
          owner_id?: string | null
          status?: number
        }
        Update: {
          billing_id?: string
          commitment_id?: string
          created_at?: string | null
          id?: number
          owner_id?: string | null
          status?: number
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      extension: {
        Args: { name: string }
        Returns: string
      }
      filename: {
        Args: { name: string }
        Returns: string
      }
      foldername: {
        Args: { name: string }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: { size: number; bucket_id: string }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits: number
          levels: number
          offsets: number
          search: string
          sortcolumn: string
          sortorder: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

