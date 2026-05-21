/**
 * Database types generated from Supabase schema
 * Run: supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
 *
 * For now, this is a placeholder that will be updated once schema is deployed
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          face_shape: string | null;
          preferred_hair_length: string | null;
          favorite_colors: string[] | null;
          budget_range: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          face_shape?: string | null;
          preferred_hair_length?: string | null;
          favorite_colors?: string[] | null;
          budget_range?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          face_shape?: string | null;
          preferred_hair_length?: string | null;
          favorite_colors?: string[] | null;
          budget_range?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      wigs: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          long_description: string | null;
          category: string;
          style: string;
          length_category: string;
          length_inches: number;
          hair_type: string;
          density: string;
          base_price: number;
          sale_price: number | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          long_description?: string | null;
          category: string;
          style: string;
          length_category: string;
          length_inches: number;
          hair_type: string;
          density: string;
          base_price: number;
          sale_price?: number | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          long_description?: string | null;
          category?: string;
          style?: string;
          length_category?: string;
          length_inches?: number;
          hair_type?: string;
          density?: string;
          base_price?: number;
          sale_price?: number | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: Record<string, unknown>;
    CompositeTypes: Record<string, unknown>;
  };
}
