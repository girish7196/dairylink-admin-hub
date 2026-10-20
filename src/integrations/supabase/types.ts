export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      collection_centres: {
        Row: {
          address: string | null
          created_at: string
          district: string | null
          id: string
          name: string
          supervisor_name: string | null
          supervisor_phone: string | null
          village: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          district?: string | null
          id?: string
          name: string
          supervisor_name?: string | null
          supervisor_phone?: string | null
          village?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          district?: string | null
          id?: string
          name?: string
          supervisor_name?: string | null
          supervisor_phone?: string | null
          village?: string | null
        }
        Relationships: []
      }
      farmers: {
        Row: {
          account_last4: string | null
          bank_name: string | null
          buffaloes_count: number
          collection_centre_id: string | null
          cows_count: number
          created_at: string
          district: string | null
          farmer_code: string
          full_name: string
          id: string
          ifsc_code: string | null
          phone: string | null
          status: string
          user_id: string | null
          village: string | null
        }
        Insert: {
          account_last4?: string | null
          bank_name?: string | null
          buffaloes_count?: number
          collection_centre_id?: string | null
          cows_count?: number
          created_at?: string
          district?: string | null
          farmer_code: string
          full_name: string
          id?: string
          ifsc_code?: string | null
          phone?: string | null
          status?: string
          user_id?: string | null
          village?: string | null
        }
        Update: {
          account_last4?: string | null
          bank_name?: string | null
          buffaloes_count?: number
          collection_centre_id?: string | null
          cows_count?: number
          created_at?: string
          district?: string | null
          farmer_code?: string
          full_name?: string
          id?: string
          ifsc_code?: string | null
          phone?: string | null
          status?: string
          user_id?: string | null
          village?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "farmers_collection_centre_id_fkey"
            columns: ["collection_centre_id"]
            isOneToOne: false
            referencedRelation: "collection_centres"
            referencedColumns: ["id"]
          },
        ]
      }
      milk_collections: {
        Row: {
          applied_rate_per_litre: number | null
          base_rate_per_litre: number | null
          collection_centre_id: string | null
          collection_date: string
          created_at: string
          farmer_id: string
          fat_percent: number | null
          id: string
          milk_type: string
          quantity_litres: number
          shift: string
          slip_number: string | null
          snf_percent: number | null
          total_amount: number | null
        }
        Insert: {
          applied_rate_per_litre?: number | null
          base_rate_per_litre?: number | null
          collection_centre_id?: string | null
          collection_date?: string
          created_at?: string
          farmer_id: string
          fat_percent?: number | null
          id?: string
          milk_type: string
          quantity_litres: number
          shift: string
          slip_number?: string | null
          snf_percent?: number | null
          total_amount?: number | null
        }
        Update: {
          applied_rate_per_litre?: number | null
          base_rate_per_litre?: number | null
          collection_centre_id?: string | null
          collection_date?: string
          created_at?: string
          farmer_id?: string
          fat_percent?: number | null
          id?: string
          milk_type?: string
          quantity_litres?: number
          shift?: string
          slip_number?: string | null
          snf_percent?: number | null
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "milk_collections_collection_centre_id_fkey"
            columns: ["collection_centre_id"]
            isOneToOne: false
            referencedRelation: "collection_centres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milk_collections_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      milk_rates: {
        Row: {
          buffalo_rate_per_litre: number
          cow_rate_per_litre: number
          created_at: string
          effective_from: string
          fat_bonus_per_percent: number | null
          id: string
          snf_bonus_per_percent: number | null
        }
        Insert: {
          buffalo_rate_per_litre: number
          cow_rate_per_litre: number
          created_at?: string
          effective_from: string
          fat_bonus_per_percent?: number | null
          id?: string
          snf_bonus_per_percent?: number | null
        }
        Update: {
          buffalo_rate_per_litre?: number
          cow_rate_per_litre?: number
          created_at?: string
          effective_from?: string
          fat_bonus_per_percent?: number | null
          id?: string
          snf_bonus_per_percent?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          farmer_id: string | null
          id: string
          is_read: boolean
          message: string
          notification_type: string | null
          title: string
        }
        Insert: {
          created_at?: string
          farmer_id?: string | null
          id?: string
          is_read?: boolean
          message: string
          notification_type?: string | null
          title: string
        }
        Update: {
          created_at?: string
          farmer_id?: string | null
          id?: string
          is_read?: boolean
          message?: string
          notification_type?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          collection_centre_id: string | null
          created_at: string
          farmer_id: string
          id: string
          paid_at: string | null
          payment_method: string | null
          payment_status: string
          period_end: string | null
          period_start: string | null
          transaction_reference: string | null
        }
        Insert: {
          amount: number
          collection_centre_id?: string | null
          created_at?: string
          farmer_id: string
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_status?: string
          period_end?: string | null
          period_start?: string | null
          transaction_reference?: string | null
        }
        Update: {
          amount?: number
          collection_centre_id?: string | null
          created_at?: string
          farmer_id?: string
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          payment_status?: string
          period_end?: string | null
          period_start?: string | null
          transaction_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_collection_centre_id_fkey"
            columns: ["collection_centre_id"]
            isOneToOne: false
            referencedRelation: "collection_centres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          role: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name: string
          id: string
          phone?: string | null
          role?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
