export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          role: 'admin' | 'master' | 'client';
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          role?: 'admin' | 'master' | 'client';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          role?: 'admin' | 'master' | 'client';
          created_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          duration: number;
          price: number;
          category: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          duration?: number;
          price?: number;
          category: string;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          duration?: number;
          price?: number;
          category?: string;
          active?: boolean;
          created_at?: string;
        };
      };
      masters: {
        Row: {
          id: string;
          profile_id: string | null;
          name: string;
          specialization: string[];
          bio: string | null;
          avatar_url: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          name: string;
          specialization?: string[];
          bio?: string | null;
          avatar_url?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string | null;
          name?: string;
          specialization?: string[];
          bio?: string | null;
          avatar_url?: string | null;
          active?: boolean;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          client_id: string | null;
          master_id: string;
          service_id: string;
          booking_date: string;
          booking_time: string;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          client_name: string;
          client_phone: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id?: string | null;
          master_id: string;
          service_id: string;
          booking_date: string;
          booking_time: string;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          client_name: string;
          client_phone: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string | null;
          master_id?: string;
          service_id?: string;
          booking_date?: string;
          booking_time?: string;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          client_name?: string;
          client_phone?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
      master_services: {
        Row: {
          id: string;
          master_id: string;
          service_id: string;
        };
        Insert: {
          id?: string;
          master_id: string;
          service_id: string;
        };
        Update: {
          id?: string;
          master_id?: string;
          service_id?: string;
        };
      };
      working_hours: {
        Row: {
          id: string;
          master_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          active: boolean;
        };
        Insert: {
          id?: string;
          master_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          active?: boolean;
        };
        Update: {
          id?: string;
          master_id?: string;
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
          active?: boolean;
        };
      };
    };
  };
};
