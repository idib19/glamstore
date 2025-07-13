// TypeScript types for Queen&apos;s Glam Supabase Database
// Generated to match the database schema

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          first_name: string
          last_name: string
          role: 'admin' | 'staff' | 'manager'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          first_name: string
          last_name: string
          role?: 'admin' | 'staff' | 'manager'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          first_name?: string
          last_name?: string
          role?: 'admin' | 'staff' | 'manager'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      store_data: {
        Row: {
          id: string
          store_name: string
          store_description: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          country: string
          phone: string | null
          contact_email: string | null
          website_url: string | null
          facebook_url: string | null
          instagram_url: string | null
          twitter_url: string | null
          tiktok_url: string | null
          youtube_url: string | null
          linkedin_url: string | null
          opening_hours: any | null
          availability_settings: any | null
          business_hours: any | null
          logo_url: string | null
          banner_url: string | null
          currency: string
          timezone: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_name?: string
          store_description?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string
          phone?: string | null
          contact_email?: string | null
          website_url?: string | null
          facebook_url?: string | null
          instagram_url?: string | null
          twitter_url?: string | null
          tiktok_url?: string | null
          youtube_url?: string | null
          linkedin_url?: string | null
          opening_hours?: any | null
          availability_settings?: any | null
          business_hours?: any | null
          logo_url?: string | null
          banner_url?: string | null
          currency?: string
          timezone?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_name?: string
          store_description?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string
          phone?: string | null
          contact_email?: string | null
          website_url?: string | null
          facebook_url?: string | null
          instagram_url?: string | null
          twitter_url?: string | null
          tiktok_url?: string | null
          youtube_url?: string | null
          linkedin_url?: string | null
          opening_hours?: any | null
          availability_settings?: any | null
          business_hours?: any | null
          logo_url?: string | null
          banner_url?: string | null
          currency?: string
          timezone?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          date_of_birth: string | null
          address: string | null
          city: string | null
          postal_code: string | null
          country: string
          notes: string | null
          loyalty_points: number
          total_spent: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          date_of_birth?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string
          notes?: string | null
          loyalty_points?: number
          total_spent?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          date_of_birth?: string | null
          address?: string | null
          city?: string | null
          postal_code?: string | null
          country?: string
          notes?: string | null
          loyalty_points?: number
          total_spent?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          slug: string
          image_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          slug: string
          image_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          slug?: string
          image_url?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          short_description: string | null
          category_id: string | null
          price: number
          sale_price: number | null
          cost_price: number | null
          sku: string | null
          barcode: string | null
          in_stock: boolean
          weight_grams: number | null
          dimensions_cm: string | null
          brand: string | null
          is_featured: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          short_description?: string | null
          category_id?: string | null
          price: number
          sale_price?: number | null
          cost_price?: number | null
          sku?: string | null
          barcode?: string | null
          in_stock?: boolean
          weight_grams?: number | null
          dimensions_cm?: string | null
          brand?: string | null
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          short_description?: string | null
          category_id?: string | null
          price?: number
          sale_price?: number | null
          cost_price?: number | null
          sku?: string | null
          barcode?: string | null
          in_stock?: boolean
          weight_grams?: number | null
          dimensions_cm?: string | null
          brand?: string | null
          is_featured?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          alt_text: string | null
          is_primary: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          image_url: string
          alt_text?: string | null
          is_primary?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          image_url?: string
          alt_text?: string | null
          is_primary?: boolean
          sort_order?: number
          created_at?: string
        }
      }

      service_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          slug: string
          image_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          slug: string
          image_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          slug?: string
          image_url?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          category_id: string | null
          price: number
          duration_minutes: number
          image_url: string | null  // Changed to TEXT type to handle longer image data URLs
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category_id?: string | null
          price: number
          duration_minutes: number
          image_url?: string | null  // Changed to TEXT type to handle longer image data URLs
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category_id?: string | null
          price?: number
          duration_minutes?: number
          image_url?: string | null  // Changed to TEXT type to handle longer image data URLs
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      appointments: {
        Row: {
          id: string
          customer_id: string
          service_id: string
          appointment_date: string
          start_time: string
          end_time: string
          status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          notes: string | null
          total_price: number
          deposit_amount: number
          deposit_paid: boolean
          reminder_sent: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          service_id: string
          appointment_date: string
          start_time: string
          end_time: string
          status?: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          notes?: string | null
          total_price: number
          deposit_amount?: number
          deposit_paid?: boolean
          reminder_sent?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          service_id?: string
          appointment_date?: string
          start_time?: string
          end_time?: string
          status?: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          notes?: string | null
          total_price?: number
          deposit_amount?: number
          deposit_paid?: boolean
          reminder_sent?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      appointment_services: {
        Row: {
          id: string
          appointment_id: string
          service_id: string
          price: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          appointment_id: string
          service_id: string
          price: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          appointment_id?: string
          service_id?: string
          price?: number
          notes?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_id: string | null
          customer_name: string | null
          customer_email: string | null
          customer_phone: string | null
          status: 'pending' | 'waiting_for_payment' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          subtotal: number
          tax_amount: number
          shipping_amount: number
          discount_amount: number
          total_amount: number
          payment_method: string | null
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          shipping_address: string | null
          billing_address: string | null
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string
          customer_id?: string | null
          customer_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          status?: 'pending' | 'waiting_for_payment' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          subtotal: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total_amount: number
          payment_method?: string | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          shipping_address?: string | null
          billing_address?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_id?: string | null
          customer_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          status?: 'pending' | 'waiting_for_payment' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          subtotal?: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total_amount?: number
          payment_method?: string | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          shipping_address?: string | null
          billing_address?: string | null
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_sku: string | null
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          product_sku?: string | null
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_sku?: string | null
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          customer_id: string | null
          customer_name: string | null
          product_id: string | null
          service_id: string | null
          appointment_id: string | null
          rating: number
          title: string | null
          comment: string | null
          is_verified: boolean
          is_approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          customer_name?: string | null
          product_id?: string | null
          service_id?: string | null
          appointment_id?: string | null
          rating: number
          title?: string | null
          comment?: string | null
          is_verified?: boolean
          is_approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string | null
          customer_name?: string | null
          product_id?: string | null
          service_id?: string | null
          appointment_id?: string | null
          rating?: number
          title?: string | null
          comment?: string | null
          is_verified?: boolean
          is_approved?: boolean
          created_at?: string
        }
      }
      loyalty_transactions: {
        Row: {
          id: string
          customer_id: string
          transaction_type: 'earned' | 'redeemed' | 'expired' | 'adjusted'
          points: number
          order_id: string | null
          appointment_id: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          transaction_type: 'earned' | 'redeemed' | 'expired' | 'adjusted'
          points: number
          order_id?: string | null
          appointment_id?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          transaction_type?: 'earned' | 'redeemed' | 'expired' | 'adjusted'
          points?: number
          order_id?: string | null
          appointment_id?: string | null
          description?: string | null
          created_at?: string
        }
      }
      promotions: {
        Row: {
          id: string
          code: string | null
          name: string
          description: string | null
          discount_type: 'percentage' | 'fixed_amount'
          discount_value: number
          minimum_order_amount: number
          maximum_discount: number | null
          usage_limit: number | null
          used_count: number
          valid_from: string | null
          valid_until: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code?: string | null
          name: string
          description?: string | null
          discount_type: 'percentage' | 'fixed_amount'
          discount_value: number
          minimum_order_amount?: number
          maximum_discount?: number | null
          usage_limit?: number | null
          used_count?: number
          valid_from?: string | null
          valid_until?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          code?: string | null
          name?: string
          description?: string | null
          discount_type?: 'percentage' | 'fixed_amount'
          discount_value?: number
          minimum_order_amount?: number
          maximum_discount?: number | null
          usage_limit?: number | null
          used_count?: number
          valid_from?: string | null
          valid_until?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          customer_id: string
          type: 'appointment_reminder' | 'appointment_confirmation' | 'appointment_details_update' | 'order_update' | 'order_confirmation' | 'promotion' | 'birthday' | 'system'
          title: string
          message: string
          is_read: boolean
          sent_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          customer_id: string
          type: 'appointment_reminder' | 'appointment_confirmation' | 'appointment_details_update' | 'order_update' | 'order_confirmation' | 'promotion' | 'birthday' | 'system'
          title: string
          message: string
          is_read?: boolean
          sent_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          customer_id?: string
          type?: 'appointment_reminder' | 'appointment_confirmation' | 'appointment_details_update' | 'order_update' | 'order_confirmation' | 'promotion' | 'birthday' | 'system'
          title?: string
          message?: string
          is_read?: boolean
          sent_at?: string
          read_at?: string | null
        }
      }
      failed_emails: {
        Row: {
          id: string
          email_type: string
          recipient_email: string
          subject: string | null
          error_message: string
          error_details: any | null
          context_data: any | null
          retry_count: number
          last_retry_at: string | null
          is_resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          resolution_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email_type: string
          recipient_email: string
          subject?: string | null
          error_message: string
          error_details?: any | null
          context_data?: any | null
          retry_count?: number
          last_retry_at?: string | null
          is_resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          resolution_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email_type?: string
          recipient_email?: string
          subject?: string | null
          error_message?: string
          error_details?: any | null
          context_data?: any | null
          retry_count?: number
          last_retry_at?: string | null
          is_resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          resolution_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sales_analytics: {
        Row: {
          id: string
          date: string
          total_sales: number
          total_orders: number
          total_appointments: number
          total_customers: number
          average_order_value: number
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          total_sales?: number
          total_orders?: number
          total_appointments?: number
          total_customers?: number
          average_order_value?: number
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          total_sales?: number
          total_orders?: number
          total_appointments?: number
          total_customers?: number
          average_order_value?: number
          created_at?: string
        }
      }
    }
    Views: {
      dashboard_overview: {
        Row: {
          orders_last_30_days: number | null
          upcoming_appointments: number | null
          new_customers_last_30_days: number | null
          reviews_last_30_days: number | null
          revenue_last_30_days: number | null
        }
      }
      out_of_stock_products: {
        Row: {
          id: string
          name: string
          sku: string | null
          category_name: string | null
        }
      }
      todays_appointments: {
        Row: {
          id: string
          appointment_date: string
          start_time: string
          end_time: string
          status: string
          customer_name: string | null
          customer_phone: string | null
          service_name: string | null
        }
      }
      product_ratings: {
        Row: {
          id: string
          name: string
          sku: string | null
          price: number | null
          in_stock: boolean | null
          is_featured: boolean | null
          short_description: string | null
          description: string | null
          brand: string | null
          category_name: string | null
          category_slug: string | null
          average_rating: number | null
          review_count: number | null
        }
      }
    }
    Functions: {
      check_appointment_availability: {
        Args: {
          p_appointment_date: string
          p_start_time: string
          p_duration_minutes: number
        }
        Returns: boolean
      }
      calculate_appointment_end_time: {
        Args: {
          p_start_time: string
          p_duration_minutes: number
        }
        Returns: string
      }
      get_customer_loyalty_points: {
        Args: {
          p_customer_id: string
        }
        Returns: number
      }
    }
  }
}

// Helper types for common operations
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types
export type User = Tables<'users'>
export type StoreData = Tables<'store_data'>
export type Customer = Tables<'customers'>
export type Product = Tables<'products'>
export type Service = Tables<'services'>
export type Appointment = Tables<'appointments'>
export type Order = Tables<'orders'>
export type Review = Tables<'reviews'>
export type FailedEmail = Tables<'failed_emails'>

// View types
export type DashboardOverview = Database['public']['Views']['dashboard_overview']['Row']
export type LowStockProduct = Database['public']['Views']['out_of_stock_products']['Row']
export type TodaysAppointment = Database['public']['Views']['todays_appointments']['Row']
export type ProductRating = Database['public']['Views']['product_ratings']['Row']

// Function types
export type CheckAppointmentAvailability = Database['public']['Functions']['check_appointment_availability']
export type CalculateAppointmentEndTime = Database['public']['Functions']['calculate_appointment_end_time']
export type GetCustomerLoyaltyPoints = Database['public']['Functions']['get_customer_loyalty_points']

// Enums
export const AppointmentStatus = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show'
} as const

export const OrderStatus = {
  PENDING: 'pending',
  WAITING_FOR_PAYMENT: 'waiting_for_payment',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
} as const

export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
} as const

export const UserRole = {
  ADMIN: 'admin',
  STAFF: 'staff',
  MANAGER: 'manager'
} as const



export const TransactionType = {
  EARNED: 'earned',
  REDEEMED: 'redeemed',
  EXPIRED: 'expired',
  ADJUSTED: 'adjusted'
} as const

export const NotificationType = {
  APPOINTMENT_REMINDER: 'appointment_reminder',
  APPOINTMENT_CONFIRMATION: 'appointment_confirmation',
  APPOINTMENT_DETAILS_UPDATE: 'appointment_details_update',
  ORDER_UPDATE: 'order_update',
  ORDER_CONFIRMATION: 'order_confirmation',
  PROMOTION: 'promotion',
  BIRTHDAY: 'birthday',
  SYSTEM: 'system'
} as const

export const DiscountType = {
  PERCENTAGE: 'percentage',
  FIXED_AMOUNT: 'fixed_amount'
} as const 