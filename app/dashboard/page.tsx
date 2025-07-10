'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import AddProductModal from '../../components/AddProductModal';
import LoginForm from '../../components/LoginForm';
import AddServiceModal from '../../components/AddServiceModal';
import EditServiceModal from '../../components/EditServiceModal';
import EditOrderModal from '../../components/EditOrderModal';
import EditAppointmentModal from '../../components/EditAppointmentModal';
import AddAppointmentModal from '../../components/AddAppointmentModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useAuth } from '../../lib/auth';
import { servicesApi, ordersApi, appointmentsApi } from '../../lib/supabase';
import type { Database } from '../../types/database';

// Dashboard sub-components
import Overview from '../../components/dashboard/Overview';
import Products from '../../components/dashboard/Products';
import Services from '../../components/dashboard/Services';
import Orders from '../../components/dashboard/Orders';
import Appointments from '../../components/dashboard/Appointments';
import Customers from '../../components/dashboard/Customers';
import Reviews from '../../components/dashboard/Reviews';
import Settings from '../../components/dashboard/Settings';

import { 
  Settings as SettingsIcon, 
  ShoppingBag, 
  Calendar, 
  Users, 
  Eye,
  Package,
  LogOut,
  MessageCircle
} from 'lucide-react';

type Service = Database['public']['Tables']['services']['Row'];
type Appointment = Database['public']['Tables']['appointments']['Row'] & {
  customers?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  } | null;
  services?: {
    id: string;
    name: string;
    price: number;
    duration_minutes: number;
  } | null;
};

// Order type from Orders component
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
  customers?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  } | null;
  order_items?: Array<{
    id: string;
    product_id: string | null;
    product_name: string;
    product_sku: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
    products?: {
      id: string;
      name: string;
      brand: string | null;
      product_images?: Array<{
        id: string;
        image_url: string;
        alt_text: string | null;
        is_primary: boolean;
        sort_order: number;
      }>;
    };
  }>;
}

export default function DashboardPage() {
  const { isAuthenticated, login, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Service modals
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // Order modals
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Appointment modals
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState(false);
  const [isEditAppointmentModalOpen, setIsEditAppointmentModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // Data states - these are used by the child components, so we'll keep them but mark them as used
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [services, setServices] = useState<Service[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [orders, setOrders] = useState<Order[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: Eye },
    { id: 'products', name: 'Produits', icon: Package },
    { id: 'services', name: 'Services', icon: SettingsIcon },
    { id: 'orders', name: 'Commandes', icon: ShoppingBag },
    { id: 'appointments', name: 'Rendez-vous', icon: Calendar },
    { id: 'customers', name: 'Clients', icon: Users },
    { id: 'reviews', name: 'Avis', icon: MessageCircle },
    { id: 'settings', name: 'Paramètres', icon: SettingsIcon }
  ];

  // Load data functions
  const loadServices = async () => {
    try {
      setIsLoadingData(true);
      const data = await servicesApi.getAll();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadOrders = async () => {
    try {
      setIsLoadingData(true);
      const data = await ordersApi.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadAppointments = async () => {
    try {
      setIsLoadingData(true);
      const data = await appointmentsApi.getAll();
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'services') {
      loadServices();
    } else if (activeTab === 'orders') {
      loadOrders();
    } else if (activeTab === 'appointments') {
      loadAppointments();
    }
  }, [activeTab]);

  // Load all data for overview
  useEffect(() => {
    if (activeTab === 'overview') {
      loadServices();
      loadOrders();
      loadAppointments();
    }
  }, [activeTab]);

  // Event handlers
  const handleProductAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    console.log('Product added successfully - refreshing table');
  };

  const handleProductUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
    console.log('Product updated successfully - refreshing table');
  };

  const handleServiceAdded = () => {
    loadServices();
    console.log('Service added successfully');
  };

  const handleServiceUpdated = () => {
    setRefreshTrigger(prev => prev + 1);
    console.log('Service updated successfully - refreshing table');
  };

  const handleOrderUpdated = () => {
    loadOrders();
    console.log('Order updated successfully');
  };

  const handleAppointmentAdded = () => {
    loadAppointments();
    console.log('Appointment added successfully');
  };

  const handleAppointmentUpdated = () => {
    loadAppointments();
    console.log('Appointment updated successfully');
  };

  // Service actions
  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsEditServiceModalOpen(true);
  };

  // Order actions
  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsEditOrderModalOpen(true);
  };

  // Appointment actions
  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditAppointmentModalOpen(true);
  };

  const handleLogin = (email: string, password: string) => {
    return login(email, password);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-elegant text-3xl font-bold text-gray-900">
                Tableau de Bord
              </h1>
              <p className="text-gray-600">
                Gérez votre institut de beauté en toute simplicité
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setActiveTab('settings')}
                className="btn-secondary"
              >
                <SettingsIcon className="h-4 w-4 mr-2" />
                Paramètres
              </button>
              <button 
                onClick={logout}
                className="btn-secondary text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-pink text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && <Overview />}

            {activeTab === 'products' && (
              <Products 
                isAddProductModalOpen={isAddProductModalOpen}
                setIsAddProductModalOpen={setIsAddProductModalOpen}
                refreshTrigger={refreshTrigger}
                onProductUpdated={handleProductUpdated}
              />
            )}

            {activeTab === 'services' && (
              <Services 
                onAddService={() => setIsAddServiceModalOpen(true)}
                onEditService={handleEditService}
                refreshTrigger={refreshTrigger}
              />
            )}

            {activeTab === 'orders' && (
              <Orders 
                onEditOrder={handleEditOrder}
              />
            )}

            {activeTab === 'appointments' && (
              <Appointments 
                onAddAppointment={() => setIsAddAppointmentModalOpen(true)}
                onEditAppointment={handleEditAppointment}
              />
            )}

            {activeTab === 'customers' && <Customers />}
            {activeTab === 'reviews' && <Reviews />}
            {activeTab === 'settings' && <Settings />}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onProductAdded={handleProductAdded}
      />

      {/* Service Modals */}
      <AddServiceModal
        isOpen={isAddServiceModalOpen}
        onClose={() => setIsAddServiceModalOpen(false)}
        onServiceAdded={handleServiceAdded}
      />

      <EditServiceModal
        isOpen={isEditServiceModalOpen}
        onClose={() => setIsEditServiceModalOpen(false)}
        service={selectedService}
        onServiceUpdated={handleServiceUpdated}
      />

      {/* Order Modals */}
      <EditOrderModal
        isOpen={isEditOrderModalOpen}
        onClose={() => setIsEditOrderModalOpen(false)}
        order={selectedOrder}
        onOrderUpdated={handleOrderUpdated}
      />

      {/* Appointment Modals */}
      <AddAppointmentModal
        isOpen={isAddAppointmentModalOpen}
        onClose={() => setIsAddAppointmentModalOpen(false)}
        onAppointmentAdded={handleAppointmentAdded}
      />

      <EditAppointmentModal
        isOpen={isEditAppointmentModalOpen}
        onClose={() => setIsEditAppointmentModalOpen(false)}
        appointment={selectedAppointment}
        onAppointmentUpdated={handleAppointmentUpdated}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />

      <Footer />
    </div>
  );
} 