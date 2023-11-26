export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      daily_results: {
        Row: {
          created_at: string
          date_key: string
          guesses: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          date_key: string
          guesses: Json
          user_id: string
        }
        Update: {
          created_at?: string
          date_key?: string
          guesses?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_results_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
}

