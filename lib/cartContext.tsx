'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { productsApi, ordersApi, customersApi } from './supabase';
import { Database } from '../types/database';

type Product = Database['public']['Tables']['products']['Row'] & {
  product_categories: {
    id: string;
    name: string;
    slug: string;
  } | null;
  product_images: {
    id: string;
    image_url: string;
    alt_text: string | null;
    is_primary: boolean;
    sort_order: number;
  }[];
};

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product.id === action.payload.product.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.product.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload]
        };
      }
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.payload.productId)
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload
      };
    
    default:
      return state;
  }
};

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country?: string;
  notes?: string;
}

interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  is_active: boolean;
}

interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  status: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method: string | null;
  payment_status: string;
  shipping_address: string | null;
  billing_address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface CartContextType {
  state: CartState;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  createOrder: (customerData: CustomerData) => Promise<Order>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoading: false,
    error: null
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCartFromStorage = async () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const cartData = JSON.parse(savedCart);
          const itemsWithProducts: CartItem[] = [];
          
          // Load product data for each cart item
          for (const item of cartData) {
            try {
              const product = await productsApi.getById(item.productId);
              itemsWithProducts.push({
                product,
                quantity: item.quantity
              });
            } catch (error) {
              console.error(`Failed to load product ${item.productId}:`, error);
              // Remove invalid items from localStorage
              const updatedCart = cartData.filter((i: { productId: string }) => i.productId !== item.productId);
              localStorage.setItem('cart', JSON.stringify(updatedCart));
            }
          }
          
          dispatch({ type: 'LOAD_CART', payload: itemsWithProducts });
        }
      } catch (error) {
        console.error('Error loading cart from storage:', error);
        localStorage.removeItem('cart');
      }
    };

    loadCartFromStorage();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const cartData = state.items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }));
    localStorage.setItem('cart', JSON.stringify(cartData));
  }, [state.items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const createOrder = async (customerData: CustomerData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Create or find customer
      let customerId: string | null = null;
      
      if (customerData.email) {
        // Try to find existing customer
        const existingCustomers = await customersApi.getAll();
        const existingCustomer = existingCustomers?.find((c: Customer) => c.email === customerData.email);
        
        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          // Create new customer
          const newCustomer = await customersApi.create({
            first_name: customerData.firstName,
            last_name: customerData.lastName,
            email: customerData.email,
            phone: customerData.phone,
            address: customerData.address,
            city: customerData.city,
            postal_code: customerData.postalCode,
            country: customerData.country || 'France',
            is_active: true
          });
          customerId = newCustomer.id;
        }
      }

      // Calculate totals
      const subtotal = getCartTotal();
      const tax = subtotal * 0.20; // 20% TVA
      const shipping = subtotal >= 50 ? 0 : 5.99; // Free shipping over 50 CAD
      const total = subtotal + tax + shipping;

      // Create order
      const order = await ordersApi.create({
        customer_id: customerId,
        customer_name: customerId ? null : `${customerData.firstName} ${customerData.lastName}`,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        status: 'pending',
        subtotal,
        tax_amount: tax,
        shipping_amount: shipping,
        discount_amount: 0,
        total_amount: total,
        payment_method: 'manual',
        payment_status: 'pending',
        shipping_address: `${customerData.address}, ${customerData.postalCode} ${customerData.city}, ${customerData.country}`,
        billing_address: `${customerData.address}, ${customerData.postalCode} ${customerData.city}, ${customerData.country}`,
        notes: customerData.notes || null
      }) as Order;

      // Add order items
      for (const item of state.items) {
        await ordersApi.addItem({
          order_id: order.id,
          product_id: item.product.id,
          product_name: item.product.name,
          product_sku: item.product.sku,
          quantity: item.quantity,
          unit_price: item.product.price,
          total_price: item.product.price * item.quantity
        });
      }

      // Clear cart after successful order
      clearCart();

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors de la création de la commande' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    createOrder
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 