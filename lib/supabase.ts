import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper functions for common operations

// Products
export const productsApi = {
  // Get all active products
  getAll: async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_categories (
          id,
          name,
          slug
        ),
        product_images (
          id,
          image_url,
          alt_text,
          is_primary,
          sort_order
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get product by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_categories (
          id,
          name,
          slug
        ),
        product_images (
          id,
          image_url,
          alt_text,
          is_primary,
          sort_order
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new product
  create: async (product: Database['public']['Tables']['products']['Insert']) => {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update product
  update: async (id: string, updates: Database['public']['Tables']['products']['Update']) => {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete product (soft delete)
  delete: async (id: string) => {
    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id)
    
    if (error) throw error
  },

  // Get out of stock products
  getOutOfStock: async () => {
    const { data, error } = await supabase
      .from('out_of_stock_products')
      .select('*')
    
    if (error) throw error
    return data
  },

  // Get products with ratings and reviews
  getWithRatings: async () => {
    const { data, error } = await supabase
      .from('product_ratings')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('average_rating', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// Categories
export const categoriesApi = {
  // Get all active product categories
  getAll: async () => {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Get category by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Get category by slug
  getBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new category
  create: async (category: Database['public']['Tables']['product_categories']['Insert']) => {
    const { data, error } = await supabase
      .from('product_categories')
      .insert(category)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update category
  update: async (id: string, updates: Database['public']['Tables']['product_categories']['Update']) => {
    const { data, error } = await supabase
      .from('product_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete category (soft delete)
  delete: async (id: string) => {
    const { error } = await supabase
      .from('product_categories')
      .update({ is_active: false })
      .eq('id', id)
    
    if (error) throw error
  }
}

// Services
export const servicesApi = {
  // Get all active services
  getAll: async () => {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        service_categories (
          id,
          name,
          slug
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get service by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        service_categories (
          id,
          name,
          slug
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new service
  create: async (service: Database['public']['Tables']['services']['Insert']) => {
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update service
  update: async (id: string, updates: Database['public']['Tables']['services']['Update']) => {
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete service (soft delete)
  delete: async (id: string) => {
    const { error } = await supabase
      .from('services')
      .update({ is_active: false })
      .eq('id', id)
    
    if (error) throw error
  }
}

// Appointments
export const appointmentsApi = {
  // Get all appointments
  getAll: async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        customers (
          id,
          first_name,
          last_name,
          email,
          phone
        ),
        services (
          id,
          name,
          price,
          duration_minutes
        ),
        users (
          id,
          first_name,
          last_name
        )
      `)
      .order('appointment_date', { ascending: true })
      .order('start_time', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Get appointments by date range
  getByDateRange: async (startDate: string, endDate: string) => {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        customers (
          id,
          first_name,
          last_name,
          email,
          phone
        ),
        services (
          id,
          name,
          price,
          duration_minutes
        )
      `)
      .gte('appointment_date', startDate)
      .lte('appointment_date', endDate)
      .order('appointment_date', { ascending: true })
      .order('start_time', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Get today's appointments
  getTodays: async () => {
    const { data, error } = await supabase
      .from('todays_appointments')
      .select('*')
      .order('start_time', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Create new appointment
  create: async (appointment: Database['public']['Tables']['appointments']['Insert']) => {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update appointment
  update: async (id: string, updates: Database['public']['Tables']['appointments']['Update']) => {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Check appointment availability
  checkAvailability: async (date: string, startTime: string, durationMinutes: number) => {
    const { data, error } = await supabase
      .rpc('check_appointment_availability', {
        p_appointment_date: date,
        p_start_time: startTime,
        p_duration_minutes: durationMinutes
      })
    
    if (error) throw error
    return data
  },

  // Calculate appointment end time
  calculateEndTime: async (startTime: string, durationMinutes: number) => {
    const { data, error } = await supabase
      .rpc('calculate_appointment_end_time', {
        p_start_time: startTime,
        p_duration_minutes: durationMinutes
      })
    
    if (error) throw error
    return data
  }
}

// Orders
export const ordersApi = {
  // Get all orders
  getAll: async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customers (
          id,
          first_name,
          last_name,
          email,
          phone
        ),
        order_items (
          id,
          product_id,
          product_name,
          product_sku,
          quantity,
          unit_price,
          total_price
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get order by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customers (
          id,
          first_name,
          last_name,
          email,
          phone
        ),
        order_items (
          id,
          product_id,
          product_name,
          product_sku,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new order
  create: async (order: Database['public']['Tables']['orders']['Insert']) => {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update order
  update: async (id: string, updates: Database['public']['Tables']['orders']['Update']) => {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Add order item
  addItem: async (item: Database['public']['Tables']['order_items']['Insert']) => {
    const { data, error } = await supabase
      .from('order_items')
      .insert(item)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Customers
export const customersApi = {
  // Get all customers
  getAll: async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get customer by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new customer
  create: async (customer: Database['public']['Tables']['customers']['Insert']) => {
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update customer
  update: async (id: string, updates: Database['public']['Tables']['customers']['Update']) => {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get customer loyalty points
  getLoyaltyPoints: async (customerId: string) => {
    const { data, error } = await supabase
      .rpc('get_customer_loyalty_points', {
        p_customer_id: customerId
      })
    
    if (error) throw error
    return data
  }
}

// Dashboard
export const dashboardApi = {
  // Get dashboard overview
  getOverview: async () => {
    const { data, error } = await supabase
      .from('dashboard_overview')
      .select('*')
      .single()
    
    if (error) throw error
    return data
  },

  // Get out of stock products
  getOutOfStockProducts: async () => {
    const { data, error } = await supabase
      .from('out_of_stock_products')
      .select('*')
    
    if (error) throw error
    return data
  },

  // Get today's appointments
  getTodaysAppointments: async () => {
    const { data, error } = await supabase
      .from('todays_appointments')
      .select('*')
    
    if (error) throw error
    return data
  }
}

// Reviews
export const reviewsApi = {
  // Get all approved reviews
  getAll: async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        customers (
          id,
          first_name,
          last_name
        ),
        products (
          id,
          name
        ),
        services (
          id,
          name
        )
      `)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Create new review
  create: async (review: Database['public']['Tables']['reviews']['Insert']) => {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update review
  update: async (id: string, updates: Database['public']['Tables']['reviews']['Update']) => {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
} 