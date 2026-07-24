export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      block_bill_payments: {
        Row: {
          amount: number;
          bill_id: string;
          created_at: string;
          id: string;
          notes: string | null;
          payer_name: string;
          payer_type: string;
          payment_date: string;
          rent_id: string | null;
          tenant_id: string | null;
        };
        Insert: {
          amount: number;
          bill_id: string;
          created_at?: string;
          id?: string;
          notes?: string | null;
          payer_name: string;
          payer_type: string;
          payment_date?: string;
          rent_id?: string | null;
          tenant_id?: string | null;
        };
        Update: {
          amount?: number;
          bill_id?: string;
          created_at?: string;
          id?: string;
          notes?: string | null;
          payer_name?: string;
          payer_type?: string;
          payment_date?: string;
          rent_id?: string | null;
          tenant_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "block_bill_payments_bill_id_fkey";
            columns: ["bill_id"];
            isOneToOne: false;
            referencedRelation: "block_bills";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "block_bill_payments_rent_id_fkey";
            columns: ["rent_id"];
            isOneToOne: true;
            referencedRelation: "rents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "block_bill_payments_tenant_id_fkey";
            columns: ["tenant_id"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
        ];
      };
      block_bills: {
        Row: {
          bill_type: string;
          block_id: string;
          created_at: string;
          id: string;
          month: string;
          notes: string | null;
          total_amount: number;
        };
        Insert: {
          bill_type: string;
          block_id: string;
          created_at?: string;
          id?: string;
          month: string;
          notes?: string | null;
          total_amount: number;
        };
        Update: {
          bill_type?: string;
          block_id?: string;
          created_at?: string;
          id?: string;
          month?: string;
          notes?: string | null;
          total_amount?: number;
        };
        Relationships: [
          {
            foreignKeyName: "block_bills_block_id_fkey";
            columns: ["block_id"];
            isOneToOne: false;
            referencedRelation: "blocks";
            referencedColumns: ["id"];
          },
        ];
      };
      admin_users: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          password_hash: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          id: string;
          password_hash?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          password_hash?: string | null;
        };
        Relationships: [];
      };
      beds: {
        Row: {
          bed_number: string;
          created_at: string;
          expected_date: string | null;
          id: string;
          pos_x: number | null;
          pos_y: number | null;
          room_id: string;
          status: string;
          tenant_id: string | null;
        };
        Insert: {
          bed_number: string;
          created_at?: string;
          expected_date?: string | null;
          id?: string;
          pos_x?: number | null;
          pos_y?: number | null;
          room_id: string;
          status?: string;
          tenant_id?: string | null;
        };
        Update: {
          bed_number?: string;
          created_at?: string;
          expected_date?: string | null;
          id?: string;
          pos_x?: number | null;
          pos_y?: number | null;
          room_id?: string;
          status?: string;
          tenant_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "beds_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "beds_tenant_id_fkey";
            columns: ["tenant_id"];
            isOneToOne: true;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
        ];
      };
      blocks: {
        Row: {
          block_name: string;
          block_type: string;
          created_at: string;
          floor: number;
          id: string;
          total_rooms: number;
        };
        Insert: {
          block_name: string;
          block_type: string;
          created_at?: string;
          floor: number;
          id?: string;
          total_rooms: number;
        };
        Update: {
          block_name?: string;
          block_type?: string;
          created_at?: string;
          floor?: number;
          id?: string;
          total_rooms?: number;
        };
        Relationships: [];
      };
      daily_menus: {
        Row: {
          breakfast: string;
          created_at: string;
          dinner: string;
          id: string;
          lunch: string;
          menu_date: string;
          updated_at: string;
        };
        Insert: {
          breakfast: string;
          created_at?: string;
          dinner: string;
          id?: string;
          lunch: string;
          menu_date: string;
          updated_at?: string;
        };
        Update: {
          breakfast?: string;
          created_at?: string;
          dinner?: string;
          id?: string;
          lunch?: string;
          menu_date?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      food_photos: {
        Row: {
          category: string;
          id: string;
          image_url: string;
          sort_order: number;
          title: string;
          uploaded_at: string;
        };
        Insert: {
          category?: string;
          id?: string;
          image_url: string;
          sort_order?: number;
          title: string;
          uploaded_at?: string;
        };
        Update: {
          category?: string;
          id?: string;
          image_url?: string;
          sort_order?: number;
          title?: string;
          uploaded_at?: string;
        };
        Relationships: [];
      };
      inquiries: {
        Row: {
          admin_note: string | null;
          created_at: string;
          email: string | null;
          id: string;
          message: string;
          name: string;
          phone: string;
          status: string;
        };
        Insert: {
          admin_note?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          message: string;
          name: string;
          phone: string;
          status?: string;
        };
        Update: {
          admin_note?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          message?: string;
          name?: string;
          phone?: string;
          status?: string;
        };
        Relationships: [];
      };
      pricing: {
        Row: {
          created_at: string;
          deposit: number;
          description: string | null;
          features: string[];
          id: string;
          inclusions: string | null;
          monthly_rate: number;
          occupancy_type: string;
          plan_name: string;
          recommended: boolean;
          sort_order: number;
          subtitle: string | null;
          tag: string | null;
        };
        Insert: {
          created_at?: string;
          deposit?: number;
          description?: string | null;
          features?: string[];
          id?: string;
          inclusions?: string | null;
          monthly_rate: number;
          occupancy_type: string;
          plan_name: string;
          recommended?: boolean;
          sort_order?: number;
          subtitle?: string | null;
          tag?: string | null;
        };
        Update: {
          created_at?: string;
          deposit?: number;
          description?: string | null;
          features?: string[];
          id?: string;
          inclusions?: string | null;
          monthly_rate?: number;
          occupancy_type?: string;
          plan_name?: string;
          recommended?: boolean;
          sort_order?: number;
          subtitle?: string | null;
          tag?: string | null;
        };
        Relationships: [];
      };
      rents: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          month: string;
          paid_to: string | null;
          payment_date: string | null;
          payment_method: string | null;
          room_id: string | null;
          status: string;
          tenant_id: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          month: string;
          paid_to?: string | null;
          payment_date?: string | null;
          payment_method?: string | null;
          room_id?: string | null;
          status?: string;
          tenant_id?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: string;
          month?: string;
          paid_to?: string | null;
          payment_date?: string | null;
          payment_method?: string | null;
          room_id?: string | null;
          status?: string;
          tenant_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "rents_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rents_tenant_id_fkey";
            columns: ["tenant_id"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
        ];
      };
      room_ac_bills: {
        Row: {
          created_at: string;
          id: string;
          month: string;
          notes: string | null;
          room_id: string;
          total_amount: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          month: string;
          notes?: string | null;
          room_id: string;
          total_amount: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          month?: string;
          notes?: string | null;
          room_id?: string;
          total_amount?: number;
        };
        Relationships: [
          {
            foreignKeyName: "room_ac_bills_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
        ];
      };
      room_ac_charges: {
        Row: {
          amount: number;
          bed_id: string | null;
          bed_number: string;
          bill_id: string;
          created_at: string;
          id: string;
          payment_date: string | null;
          status: string;
          tenant_id: string | null;
          tenant_name: string | null;
        };
        Insert: {
          amount: number;
          bed_id?: string | null;
          bed_number: string;
          bill_id: string;
          created_at?: string;
          id?: string;
          payment_date?: string | null;
          status?: string;
          tenant_id?: string | null;
          tenant_name?: string | null;
        };
        Update: {
          amount?: number;
          bed_id?: string | null;
          bed_number?: string;
          bill_id?: string;
          created_at?: string;
          id?: string;
          payment_date?: string | null;
          status?: string;
          tenant_id?: string | null;
          tenant_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "room_ac_charges_bed_id_fkey";
            columns: ["bed_id"];
            isOneToOne: false;
            referencedRelation: "beds";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "room_ac_charges_bill_id_fkey";
            columns: ["bill_id"];
            isOneToOne: false;
            referencedRelation: "room_ac_bills";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "room_ac_charges_tenant_id_fkey";
            columns: ["tenant_id"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
        ];
      };
      rooms: {
        Row: {
          block_id: string;
          capacity: number;
          created_at: string;
          height: number;
          id: string;
          pos_x: number;
          pos_y: number;
          room_number: string;
          room_type: string;
          status: string;
          width: number;
        };
        Insert: {
          block_id: string;
          capacity: number;
          created_at?: string;
          height?: number;
          id?: string;
          pos_x?: number;
          pos_y?: number;
          room_number: string;
          room_type: string;
          status?: string;
          width?: number;
        };
        Update: {
          block_id?: string;
          capacity?: number;
          created_at?: string;
          height?: number;
          id?: string;
          pos_x?: number;
          pos_y?: number;
          room_number?: string;
          room_type?: string;
          status?: string;
          width?: number;
        };
        Relationships: [
          {
            foreignKeyName: "rooms_block_id_fkey";
            columns: ["block_id"];
            isOneToOne: false;
            referencedRelation: "blocks";
            referencedColumns: ["id"];
          },
        ];
      };
      tenants: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          join_date: string;
          name: string;
          phone: string;
          rent_amount: number;
          room_id: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          join_date: string;
          name: string;
          phone: string;
          rent_amount?: number;
          room_id?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          join_date?: string;
          name?: string;
          phone?: string;
          rent_amount?: number;
          room_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tenants_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
