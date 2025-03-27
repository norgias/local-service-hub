export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string;
          name: string;
          category: string;
          slug: string;
          description: string;
          accepts_onsite_booking: boolean;
          affiliate_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          slug: string;
          description: string;
          accepts_onsite_booking: boolean;
          affiliate_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          slug?: string;
          description?: string;
          accepts_onsite_booking?: boolean;
          affiliate_url?: string | null;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          business_id: string;
          customer_name: string;
          customer_email: string;
          service_requested: string;
          booking_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          customer_name: string;
          customer_email: string;
          service_requested: string;
          booking_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          customer_name?: string;
          customer_email?: string;
          service_requested?: string;
          booking_date?: string;
          created_at?: string;
        };
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          business_name: string;
          email: string;
          category: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          business_name: string;
          email: string;
          category: string;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          business_name?: string;
          email?: string;
          category?: string;
          message?: string;
          created_at?: string;
        };
      };
    };
  };
}