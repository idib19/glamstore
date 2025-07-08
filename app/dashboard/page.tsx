'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import AddProductModal from '../../components/AddProductModal';
import ProductsTable from '../../components/ProductsTable';
import LoginForm from '../../components/LoginForm';
import AddServiceModal from '../../components/AddServiceModal';
import EditServiceModal from '../../components/EditServiceModal';
import EditOrderModal from '../../components/EditOrderModal';
import EditAppointmentModal from '../../components/EditAppointmentModal';
import AddAppointmentModal from '../../components/AddAppointmentModal';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useAuth } from '../../lib/auth';
import { servicesApi, ordersApi, appointmentsApi } from '../../lib/supabase';

import { 
  Settings, 
  ShoppingBag, 
  Calendar, 
  Users, 
  Star, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  TrendingUp,
  LogOut
} from 'lucide-react';

export default function DashboardPage() {
  const { isAuthenticated, login, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Service modals
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  
  // Order modals
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // Appointment modals
  const [isAddAppointmentModalOpen, setIsAddAppointmentModalOpen] = useState(false);
  const [isEditAppointmentModalOpen, setIsEditAppointmentModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  
  // Data states
  const [services, setServices] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const stats = [
    { title: 'Commandes', value: '24', change: '+12%', icon: ShoppingBag },
    { title: 'Rendez-vous', value: '18', change: '+8%', icon: Calendar },
    { title: 'Clients', value: '156', change: '+5%', icon: Users },
    { title: 'Avis', value: '89', change: '+15%', icon: Star }
  ];

  const recentOrders = [
    { id: 1, customer: 'Marie L.', total: 95.50, status: 'En attente', date: '15 déc 2024' },
    { id: 2, customer: 'Sophie D.', total: 67.80, status: 'Confirmée', date: '14 déc 2024' },
    { id: 3, customer: 'Claire M.', total: 125.00, status: 'Livrée', date: '13 déc 2024' },
    { id: 4, customer: 'Julie R.', total: 45.20, status: 'En attente', date: '12 déc 2024' }
  ];

  const recentAppointments = [
    { id: 1, customer: 'Anne S.', service: 'Soin du visage', date: '16 déc 2024', time: '14:00' },
    { id: 2, customer: 'Isabelle T.', service: 'Maquillage', date: '16 déc 2024', time: '16:30' },
    { id: 3, customer: 'Nathalie B.', service: 'Massage', date: '17 déc 2024', time: '10:00' },
    { id: 4, customer: 'Caroline F.', service: 'Manucure', date: '17 déc 2024', time: '15:00' }
  ];

  // Mock data for services (will be replaced with real data)
  const mockServices = [
    { id: 1, name: 'Soin Hydratant', price: 45, duration: '45 min', category: 'Soins du visage' },
    { id: 2, name: 'Soin Anti-âge', price: 65, duration: '60 min', category: 'Soins du visage' },
    { id: 3, name: 'Maquillage Jour', price: 35, duration: '30 min', category: 'Maquillage' },
    { id: 4, name: 'Maquillage Soirée', price: 50, duration: '45 min', category: 'Maquillage' }
  ];

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: Eye },
    { id: 'products', name: 'Produits', icon: Package },
    { id: 'services', name: 'Services', icon: Settings },
    { id: 'orders', name: 'Commandes', icon: ShoppingBag },
    { id: 'appointments', name: 'Rendez-vous', icon: Calendar },
    { id: 'customers', name: 'Clients', icon: Users }
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

  // Event handlers
  const handleProductAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    console.log('Product added successfully - refreshing table');
  };

  const handleServiceAdded = () => {
    loadServices();
    console.log('Service added successfully');
  };

  const handleServiceUpdated = () => {
    loadServices();
    console.log('Service updated successfully');
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
  const handleEditService = (service: any) => {
    setSelectedService(service);
    setIsEditServiceModalOpen(true);
  };

  const handleDeleteService = async (serviceId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Supprimer le service',
      message: 'Êtes-vous sûr de vouloir supprimer ce service ? Cette action ne peut pas être annulée.',
      onConfirm: async () => {
        try {
          await servicesApi.delete(serviceId);
          loadServices();
          console.log('Service deleted successfully');
        } catch (error) {
          console.error('Error deleting service:', error);
          alert('Erreur lors de la suppression du service');
        }
      }
    });
  };

  // Order actions
  const handleEditOrder = (order: any) => {
    setSelectedOrder(order);
    setIsEditOrderModalOpen(true);
  };

  // Appointment actions
  const handleEditAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsEditAppointmentModalOpen(true);
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Annuler le rendez-vous',
      message: 'Êtes-vous sûr de vouloir annuler ce rendez-vous ?',
      onConfirm: async () => {
        try {
          await appointmentsApi.update(appointmentId, { status: 'cancelled' });
          loadAppointments();
          console.log('Appointment cancelled successfully');
        } catch (error) {
          console.error('Error cancelling appointment:', error);
          alert('Erreur lors de l\'annulation du rendez-vous');
        }
      }
    });
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
              <button className="btn-secondary">
                <Settings className="h-4 w-4 mr-2" />
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
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className="bg-soft-pink rounded-full p-3">
                          <stat.icon className="h-6 w-6 text-primary-pink" />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">{stat.change}</span>
                        <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Commandes Récentes</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="bg-primary-pink rounded-full p-2">
                              <ShoppingBag className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{order.customer}</p>
                              <p className="text-sm text-gray-600">{order.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{order.total}€</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              order.status === 'Confirmée' ? 'bg-green-100 text-green-800' :
                              order.status === 'Livrée' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Appointments */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Rendez-vous à Venir</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="bg-primary-pink rounded-full p-2">
                              <Calendar className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{appointment.customer}</p>
                              <p className="text-sm text-gray-600">{appointment.service}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{appointment.date}</p>
                            <p className="text-sm text-gray-600">{appointment.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                {/* Products Management */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Gestion des Produits</h3>
                    <button 
                      onClick={() => setIsAddProductModalOpen(true)}
                      className="btn-primary"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un Produit
                    </button>
                  </div>
                  <div className="p-6">
                    <ProductsTable 
                      refreshTrigger={refreshTrigger}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Gestion des Services</h3>
                  <button 
                    onClick={() => setIsAddServiceModalOpen(true)}
                    className="btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un Service
                  </button>
                </div>
                <div className="p-6">
                  {isLoadingData ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-pink"></div>
                      <span className="ml-2 text-gray-600">Chargement des services...</span>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Service
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Catégorie
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Prix
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Durée
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {services.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                Aucun service trouvé
                              </td>
                            </tr>
                          ) : (
                            services.map((service) => (
                              <tr key={service.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{service.name}</div>
                                  {service.description && (
                                    <div className="text-sm text-gray-500">{service.description}</div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {service.service_categories?.name || 'Non catégorisé'}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{service.price}€</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{service.duration_minutes} min</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                    <button 
                                      onClick={() => handleEditService(service)}
                                      className="text-primary-pink hover:text-dark-pink transition-colors"
                                      title="Modifier"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteService(service.id)}
                                      className="text-red-600 hover:text-red-900 transition-colors"
                                      title="Supprimer"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Gestion des Commandes</h3>
                </div>
                <div className="p-6">
                  {isLoadingData ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-pink"></div>
                      <span className="ml-2 text-gray-600">Chargement des commandes...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          Aucune commande trouvée
                        </div>
                      ) : (
                        orders.map((order) => (
                          <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="font-medium text-gray-900">Commande #{order.order_number}</h4>
                                <p className="text-sm text-gray-600">
                                  Client: {order.customers ? 
                                    `${order.customers.first_name} ${order.customers.last_name}` : 
                                    order.customer_name || 'Client non enregistré'
                                  }
                                </p>
                                <p className="text-sm text-gray-600">
                                  Date: {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">{order.total_amount}€</p>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                  order.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {order.status === 'pending' ? 'En attente' :
                                   order.status === 'confirmed' ? 'Confirmée' :
                                   order.status === 'delivered' ? 'Livrée' :
                                   order.status === 'cancelled' ? 'Annulée' :
                                   order.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditOrder(order)}
                                className="btn-primary text-sm"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Modifier
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Gestion des Rendez-vous</h3>
                  <button 
                    onClick={() => setIsAddAppointmentModalOpen(true)}
                    className="btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un Rendez-vous
                  </button>
                </div>
                <div className="p-6">
                  {isLoadingData ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-pink"></div>
                      <span className="ml-2 text-gray-600">Chargement des rendez-vous...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          Aucun rendez-vous trouvé
                        </div>
                      ) : (
                        appointments.map((appointment) => (
                          <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="font-medium text-gray-900">RDV #{appointment.id.slice(0, 8)}</h4>
                                <p className="text-sm text-gray-600">
                                  Client: {appointment.customers ? 
                                    `${appointment.customers.first_name} ${appointment.customers.last_name}` : 
                                    'Client non trouvé'
                                  }
                                </p>
                                <p className="text-sm text-gray-600">
                                  Service: {appointment.services?.name || 'Service non trouvé'}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  {new Date(appointment.appointment_date).toLocaleDateString('fr-FR')}
                                </p>
                                <p className="text-sm text-gray-600">{appointment.start_time}</p>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                  appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                  appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  appointment.status === 'no_show' ? 'bg-gray-100 text-gray-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {appointment.status === 'scheduled' ? 'Programmé' :
                                   appointment.status === 'confirmed' ? 'Confirmé' :
                                   appointment.status === 'completed' ? 'Terminé' :
                                   appointment.status === 'cancelled' ? 'Annulé' :
                                   appointment.status === 'no_show' ? 'Absent' :
                                   appointment.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditAppointment(appointment)}
                                className="btn-primary text-sm"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Modifier
                              </button>
                              {appointment.status !== 'cancelled' && (
                                <button 
                                  onClick={() => handleDeleteAppointment(appointment.id)}
                                  className="btn-secondary text-sm text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Annuler
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Gestion des Clients</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">
                    Interface de gestion des clients à développer...
                  </p>
                </div>
              </div>
            )}
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