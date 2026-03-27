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
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      feed_items: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          link: string
          published_at: string | null
          source_id: string
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          link: string
          published_at?: string | null
          source_id: string
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          link?: string
          published_at?: string | null
          source_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_items_source_id_fkey"
            columns: ["source_id"]
            referencedRelation: "sources"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          display_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          display_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          display_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      sources: {
        Row: {
          category_id: string | null
          created_at: string | null
          id: string
          name: string
          url: string
          user_id: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          url: string
          user_id: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sources_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sources_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_selections: {
        Row: {
          comment: string | null
          created_at: string | null
          feed_item_id: string
          id: string
          is_exported: boolean | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          feed_item_id: string
          id?: string
          is_exported?: boolean | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          feed_item_id?: string
          id?: string
          is_exported?: boolean | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_selections_feed_item_id_fkey"
            columns: ["feed_item_id"]
            referencedRelation: "feed_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_selections_user_id_fkey"
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
