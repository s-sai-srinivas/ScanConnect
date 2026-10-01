export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      scanconnect_businesses: {
        Row: {
          address: string | null;
          created_at: string | null;
          id: string;
          instagram: string | null;
          is_active: boolean | null;
          is_open: boolean | null;
          is_premium: boolean | null;
          is_published: boolean | null;
          logo_url: string | null;
          menu_template: string | null;
          name: string;
          opening_hours: string | null;
          owner_id: string | null;
          phone: string | null;
          slug: string;
          whatsapp: string | null;
          website: string | null;
          swiggy_url: string | null;
          zomato_url: string | null;
          google_reviews_url: string | null;
        };
        Insert: {
          address?: string | null;
          created_at?: string | null;
          id?: string;
          instagram?: string | null;
          is_active?: boolean | null;
          is_open?: boolean | null;
          is_premium?: boolean | null;
          is_published?: boolean | null;
          logo_url?: string | null;
          menu_template?: string | null;
          name: string;
          opening_hours?: string | null;
          owner_id?: string | null;
          phone?: string | null;
          slug: string;
          whatsapp?: string | null;
          website?: string | null;
          swiggy_url?: string | null;
          zomato_url?: string | null;
          google_reviews_url?: string | null;
        };
        Update: {
          address?: string | null;
          created_at?: string | null;
          id?: string;
          instagram?: string | null;
          is_active?: boolean | null;
          is_open?: boolean | null;
          is_premium?: boolean | null;
          is_published?: boolean | null;
          logo_url?: string | null;
          menu_template?: string | null;
          name?: string;
          opening_hours?: string | null;
          owner_id?: string | null;
          phone?: string | null;
          slug?: string;
          whatsapp?: string | null;
          website?: string | null;
          swiggy_url?: string | null;
          zomato_url?: string | null;
          google_reviews_url?: string | null;
        };
        Relationships: [];
      };
      scanconnect_menu_categories: {
        Row: {
          business_id: string;
          id: string;
          name: string;
          sort_order: number | null;
        };
        Insert: {
          business_id: string;
          id?: string;
          name: string;
          sort_order?: number | null;
        };
        Update: {
          business_id?: string;
          id?: string;
          name?: string;
          sort_order?: number | null;
        };
        Relationships: [];
      };
      scanconnect_menu_items: {
        Row: {
          category_id: string;
          id: string;
          image_url: string | null;
          is_available: boolean | null;
          is_veg: boolean | null;
          name: string;
          price: number;
          sort_order: number | null;
          view_count: number | null;
        };
        Insert: {
          category_id: string;
          id?: string;
          image_url?: string | null;
          is_available?: boolean | null;
          is_veg?: boolean | null;
          name: string;
          price: number;
          sort_order?: number | null;
          view_count?: number | null;
        };
        Update: {
          category_id?: string;
          id?: string;
          image_url?: string | null;
          is_available?: boolean | null;
          is_veg?: boolean | null;
          name?: string;
          price?: number;
          sort_order?: number | null;
          view_count?: number | null;
        };
        Relationships: [];
      };
      scanconnect_profiles: {
        Row: {
          created_at: string | null;
          email: string | null;
          id: string;
          is_admin: boolean | null;
          name: string | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          id: string;
          is_admin?: boolean | null;
          name?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          id?: string;
          is_admin?: boolean | null;
          name?: string | null;
        };
        Relationships: [];
      };
      scanconnect_qr_tables: {
        Row: {
          id: string;
          business_id: string;
          table_name: string;
          qr_slug: string;
          scan_count: number | null;
        };
        Insert: {
          id?: string;
          business_id: string;
          table_name: string;
          qr_slug: string;
          scan_count?: number | null;
        };
        Update: {
          id?: string;
          business_id?: string;
          table_name?: string;
          qr_slug?: string;
          scan_count?: number | null;
        };
        Relationships: [];
      };
      scanconnect_scans: {
        Row: {
          id: string;
          business_id: string;
          table_id: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          business_id: string;
          table_id?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          business_id?: string;
          table_id?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      scanconnect_interactions: {
        Row: {
          id: string;
          business_id: string;
          table_id: string | null;
          type: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          business_id: string;
          table_id?: string | null;
          type: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          business_id?: string;
          table_id?: string | null;
          type?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
