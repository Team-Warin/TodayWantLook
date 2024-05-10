// npx supabase gen types typescript --project-id "fppbvujbkhuxipoivhxy" --schema todaywantlook > ./src/types/supabase-twl.d.ts -y

export type Json = {
  new: boolean;
  adult: boolean;
  rest: boolean;
  up: boolean;
  singularityList: string[];
};

export type Database = {
  todaywantlook: {
    Tables: {
      medias: {
        Row: {
          additional: Json | null;
          author: string | null;
          backdropImg: string | null;
          genre: string[];
          img: string | null;
          mediaId: string;
          rate: number;
          service: string | null;
          summary: string;
          title: string;
          type: string;
          updateDays: string[] | null;
          url: string | null;
          youtube: string[];
        };
        Insert: {
          additional?: Json | null;
          author?: string | null;
          backdropImg?: string | null;
          genre: string[];
          img?: string | null;
          mediaId?: string;
          rate?: number;
          service?: string | null;
          summary: string;
          title: string;
          type: string;
          updateDays?: string[] | null;
          url?: string | null;
          youtube?: string[];
        };
        Update: {
          additional?: Json | null;
          author?: string | null;
          backdropImg?: string | null;
          genre?: string[];
          img?: string | null;
          mediaId?: string;
          rate?: number;
          service?: string | null;
          summary?: string;
          title?: string;
          type?: string;
          updateDays?: string[] | null;
          url?: string | null;
          youtube?: string[];
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_count:
        | {
            Args: Record<PropertyKey, never>;
            Returns: number;
          }
        | {
            Args: {
              _title: string;
              _type: string;
              _genre: string;
              _additional: string;
              _update: string;
            };
            Returns: number;
          }
        | {
            Args: {
              _title: string;
              _type: string;
              _genre: string;
              _update: string;
            };
            Returns: number;
          };
      get_medias:
        | {
            Args: {
              _title: string;
              _type: string;
              _genre: string;
              _additional: string;
              _update: string;
            };
            Returns: {
              additional: Json | null;
              author: string | null;
              backdropImg: string | null;
              genre: string[];
              img: string | null;
              mediaId: string;
              rate: number;
              service: string | null;
              summary: string;
              title: string;
              type: string;
              updateDays: string[] | null;
              url: string | null;
              youtube: string[];
            }[];
          }
        | {
            Args: {
              _title: string;
              _type: string;
              _genre: string;
              _update: string;
            };
            Returns: {
              additional: Json | null;
              author: string | null;
              backdropImg: string | null;
              genre: string[];
              img: string | null;
              mediaId: string;
              rate: number;
              service: string | null;
              summary: string;
              title: string;
              type: string;
              updateDays: string[] | null;
              url: string | null;
              youtube: string[];
            }[];
          };
      get_random_medias: {
        Args: {
          length: number;
        };
        Returns: {
          additional: Json | null;
          author: string | null;
          backdropImg: string | null;
          genre: string[];
          img: string | null;
          mediaId: string;
          rate: number;
          service: string | null;
          summary: string;
          title: string;
          type: string;
          updateDays: string[] | null;
          url: string | null;
          youtube: string[];
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;
