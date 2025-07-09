import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are not configured');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper functions for common operations

// Storage API for image uploads
export const storageApi = {
  // Upload image to products bucket
  // Upload image to products bucket
  uploadProductImage: async (file: File, fileName: string) => {
    const { data, error } = await supabase.storage
      .from('produitsimages')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      // Provide specific error message for RLS policy issues
      if (error.message.includes('row-level security policy')) {
        throw new Error('Upload blocked by security policies. Please check bucket permissions in Supabase Dashboard.');
      }
      
      throw new Error(`Upload failed: ${error.message || 'Unknown upload error'}`);
    }
    
    return data;
  },

  // Get public URL for uploaded image
  getPublicUrl: (path: string) => {
    const { data } = supabase.storage
      .from('produitsimages')
      .getPublicUrl(path)
    
    return data.publicUrl
  },

  // Delete image from storage
  deleteImage: async (path: string) => {
    const { error } = await supabase.storage
      .from('produitsimages')
      .remove([path])
    
    if (error) throw error
  }
}

// Product Images API
export const productImagesApi = {
  // Create product image record
  create: async (imageData: Database['public']['Tables']['product_images']['Insert']) => {
    const { data, error } = await supabase
      .from('product_images')
      .insert(imageData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get images for a product
  getByProductId: async (productId: string) => {
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('sort_order', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Delete product image
  delete: async (id: string) => {
    const { error } = await supabase
      .from('product_images')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

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

  // Get all active service categories
  getServiceCategories: async () => {
    const { data, error } = await supabase
      .from('service_categories')
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
  },

  // Service Categories API
  // Get service category by ID
  getServiceCategoryById: async (id: string) => {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Get service category by slug
  getServiceCategoryBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new service category
  createServiceCategory: async (category: Database['public']['Tables']['service_categories']['Insert']) => {
    const { data, error } = await supabase
      .from('service_categories')
      .insert(category)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update service category
  updateServiceCategory: async (id: string, updates: Database['public']['Tables']['service_categories']['Update']) => {
    const { data, error } = await supabase
      .from('service_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete service category (soft delete)
  deleteServiceCategory: async (id: string) => {
    const { error } = await supabase
      .from('service_categories')
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
  // Test database connection and table structure
  testConnection: async () => {
    console.log('🔍 [appointmentsApi.testConnection] Testing database connection...');
    
    try {
      // Test basic connection
      const { error: testError } = await supabase
        .from('appointments')
        .select('count')
        .limit(1);
      
      console.log('🔍 [appointmentsApi.testConnection] Basic connection test:', {
        success: !testError,
        error: testError
      });
      
      // Test table structure
      const { data: structureData, error: structureError } = await supabase
        .from('appointments')
        .select(`
          id,
          customer_id,
          service_id,
          appointment_date,
          start_time,
          end_time,
          status,
          total_price
        `)
        .limit(1);
      
      console.log('🔍 [appointmentsApi.testConnection] Table structure test:', {
        success: !structureError,
        error: structureError,
        sampleData: structureData?.[0]
      });
      
      return {
        connectionOk: !testError,
        structureOk: !structureError,
        testError,
        structureError
      };
    } catch (error) {
      console.error('❌ [appointmentsApi.testConnection] Test failed:', error);
      return {
        connectionOk: false,
        structureOk: false,
        error
      };
    }
  },

  // Get all appointments
  getAll: async () => {
    console.log('🔍 [appointmentsApi.getAll] Starting appointment fetch...');
    
    try {
      console.log('🔍 [appointmentsApi.getAll] Building query...');
      
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
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true })
      
      console.log('🔍 [appointmentsApi.getAll] Query executed');
      console.log('🔍 [appointmentsApi.getAll] Error:', error);
      console.log('🔍 [appointmentsApi.getAll] Data count:', data?.length || 0);
      
      if (error) {
        console.error('❌ [appointmentsApi.getAll] Supabase error:', error);
        console.error('❌ [appointmentsApi.getAll] Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      if (!data) {
        console.warn('⚠️ [appointmentsApi.getAll] No data returned from query');
        return [];
      }
      
      console.log('✅ [appointmentsApi.getAll] Successfully fetched appointments:', {
        total: data.length,
        sample: data.slice(0, 2).map(apt => ({
          id: apt.id,
          date: apt.appointment_date,
          time: apt.start_time,
          customer: apt.customers ? `${apt.customers.first_name} ${apt.customers.last_name}` : 'No customer',
          service: apt.services?.name || 'No service',
          status: apt.status
        }))
      });
      
      return data;
    } catch (error) {
      console.error('❌ [appointmentsApi.getAll] Unexpected error:', error);
      console.error('❌ [appointmentsApi.getAll] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
  },

  // Get appointments by date range
  getByDateRange: async (startDate: string, endDate: string) => {
    console.log('🔍 [appointmentsApi.getByDateRange] Fetching appointments from', startDate, 'to', endDate);
    
    try {
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
      
      console.log('✅ [appointmentsApi.getByDateRange] Found', data?.length || 0, 'appointments');
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('❌ [appointmentsApi.getByDateRange] Error:', error);
      throw error;
    }
  },

  // Get today's appointments
  getTodays: async () => {
    console.log('🔍 [appointmentsApi.getTodays] Fetching today\'s appointments...');
    
    try {
      const { data, error } = await supabase
        .from('todays_appointments')
        .select('*')
        .order('start_time', { ascending: true })
      
      console.log('✅ [appointmentsApi.getTodays] Found', data?.length || 0, 'appointments today');
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('❌ [appointmentsApi.getTodays] Error:', error);
      throw error;
    }
  },

  // Create new appointment
  create: async (appointment: Database['public']['Tables']['appointments']['Insert']) => {
    console.log('🔍 [appointmentsApi.create] Creating new appointment:', {
      customer_id: appointment.customer_id,
      service_id: appointment.service_id,
      date: appointment.appointment_date,
      time: appointment.start_time,
      status: appointment.status
    });
    
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointment)
        .select()
        .single()
      
      if (error) {
        console.error('❌ [appointmentsApi.create] Error creating appointment:', error);
        throw error;
      }
      
      console.log('✅ [appointmentsApi.create] Appointment created successfully:', data.id);
      return data
    } catch (error) {
      console.error('❌ [appointmentsApi.create] Unexpected error:', error);
      throw error;
    }
  },

  // Update appointment
  update: async (id: string, updates: Database['public']['Tables']['appointments']['Update']) => {
    console.log('🔍 [appointmentsApi.update] Updating appointment:', id, 'with updates:', updates);
    
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('❌ [appointmentsApi.update] Error updating appointment:', error);
        throw error;
      }
      
      console.log('✅ [appointmentsApi.update] Appointment updated successfully');
      return data
    } catch (error) {
      console.error('❌ [appointmentsApi.update] Unexpected error:', error);
      throw error;
    }
  },

  // Check appointment availability
  checkAvailability: async (date: string, startTime: string, durationMinutes: number) => {
    console.log('🔍 [appointmentsApi.checkAvailability] Checking availability for:', {
      date,
      startTime,
      durationMinutes
    });
    
    try {
      const { data, error } = await supabase
        .rpc('check_appointment_availability', {
          p_appointment_date: date,
          p_start_time: startTime,
          p_duration_minutes: durationMinutes
        })
      
      if (error) {
        console.error('❌ [appointmentsApi.checkAvailability] Error checking availability:', error);
        throw error;
      }
      
      console.log('✅ [appointmentsApi.checkAvailability] Availability result:', data);
      return data
    } catch (error) {
      console.error('❌ [appointmentsApi.checkAvailability] Unexpected error:', error);
      throw error;
    }
  },

  // Calculate appointment end time
  calculateEndTime: async (startTime: string, durationMinutes: number) => {
    console.log('🔍 [appointmentsApi.calculateEndTime] Calculating end time for:', {
      startTime,
      durationMinutes
    });
    
    try {
      const { data, error } = await supabase
        .rpc('calculate_appointment_end_time', {
          p_start_time: startTime,
          p_duration_minutes: durationMinutes
        })
      
      if (error) {
        console.error('❌ [appointmentsApi.calculateEndTime] Error calculating end time:', error);
        throw error;
      }
      
      console.log('✅ [appointmentsApi.calculateEndTime] End time calculated:', data);
      return data
    } catch (error) {
      console.error('❌ [appointmentsApi.calculateEndTime] Unexpected error:', error);
      throw error;
    }
  },

  // Delete appointment (soft delete by updating status)
  delete: async (id: string) => {
    console.log('🔍 [appointmentsApi.delete] Cancelling appointment:', id);
    
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', id)
      
      if (error) {
        console.error('❌ [appointmentsApi.delete] Error cancelling appointment:', error);
        throw error;
      }
      
      console.log('✅ [appointmentsApi.delete] Appointment cancelled successfully');
    } catch (error) {
      console.error('❌ [appointmentsApi.delete] Unexpected error:', error);
      throw error;
    }
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
          total_price,
          products (
            id,
            name,
            product_images (
              id,
              image_url,
              alt_text,
              is_primary,
              sort_order
            )
          )
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
          total_price,
          products (
            id,
            name,
            product_images (
              id,
              image_url,
              alt_text,
              is_primary,
              sort_order
            )
          )
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
  },

  // Delete order (soft delete by updating status)
  delete: async (id: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', id)
    
    if (error) throw error
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

  // Get all reviews (for admin dashboard)
  getAllForAdmin: async () => {
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