'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Calendar, 
  Settings, 
  Star, 
  TrendingUp
} from 'lucide-react';
import { servicesApi, ordersApi, appointmentsApi } from '../../lib/supabase';

interface Order {
  id: string;
  customer_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  customers?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  customer_name?: string;
}

interface Appointment {
  id: string;
  appointment_date: string;
  start_time: string;
  status: string;
  customers?: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  services?: {
    id: string;
    name: string;
  } | null;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
}

export default function Overview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load all data for overview
  useEffect(() => {
    const loadOverviewData = async () => {
      console.log('🔍 [Overview] Starting to load overview data...');
      
      try {
        setIsLoading(true);
        
        console.log('🔍 [Overview] Calling APIs in parallel...');
        const [ordersData, appointmentsData, servicesData] = await Promise.all([
          ordersApi.getAll(),
          appointmentsApi.getAll(),
          servicesApi.getAll()
        ]);
        
        console.log('🔍 [Overview] All APIs completed:', {
          orders: ordersData?.length || 0,
          appointments: appointmentsData?.length || 0,
          services: servicesData?.length || 0
        });
        
        console.log('🔍 [Overview] Appointments data sample:', appointmentsData?.slice(0, 2).map(apt => ({
          id: apt.id,
          date: apt.appointment_date,
          customer: apt.customers ? `${apt.customers.first_name} ${apt.customers.last_name}` : 'No customer',
          service: apt.services?.name || 'No service',
          status: apt.status
        })));
        
        setOrders(ordersData);
        setAppointments(appointmentsData);
        setServices(servicesData);
        
        console.log('✅ [Overview] Overview data loaded successfully');
      } catch (error) {
        console.error('❌ [Overview] Error loading overview data:', error);
      } finally {
        setIsLoading(false);
        console.log('🔍 [Overview] Overview loading completed');
      }
    };

    loadOverviewData();
  }, []);

  // Calculate stats from real data
  const stats = [
    { 
      title: 'Commandes', 
      value: orders.length.toString(), 
      change: '+12%', 
      icon: ShoppingBag 
    },
    { 
      title: 'Rendez-vous', 
      value: appointments.length.toString(), 
      change: '+8%', 
      icon: Calendar 
    },
    { 
      title: 'Services', 
      value: services.length.toString(), 
      change: '+5%', 
      icon: Settings 
    },
    { 
      title: 'Avis', 
      value: '89', 
      change: '+15%', 
      icon: Star 
    }
  ];

  // Get recent orders (last 4 orders)
  const getRecentOrders = () => {
    return orders
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 4)
      .map(order => ({
        id: order.id,
        customer: order.customers ? 
          `${order.customers.first_name} ${order.customers.last_name}` : 
          order.customer_name || 'Client non enregistré',
        total: order.total_amount,
        status: order.status,
        date: new Date(order.created_at).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short'
        })
      }));
  };

  // Get recent appointments (next 7 days)
  const getRecentAppointments = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return appointments
      .filter(appointment => {
        const appointmentDate = new Date(appointment.appointment_date);
        return appointmentDate >= today && appointmentDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())
      .slice(0, 4)
      .map(appointment => ({
        id: appointment.id,
        customer: appointment.customers ? 
          `${appointment.customers.first_name} ${appointment.customers.last_name}` : 
          'Client non trouvé',
        service: appointment.services?.name || 'Service non trouvé',
        date: new Date(appointment.appointment_date).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short'
        }),
        time: appointment.start_time,
        status: appointment.status
      }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
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
            {getRecentOrders().length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune commande récente
              </div>
            ) : (
              getRecentOrders().map((order) => (
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
              ))
            )}
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
            {getRecentAppointments().length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucun rendez-vous prévu dans les 7 prochains jours
              </div>
            ) : (
              getRecentAppointments().map((appointment: {
                id: string;
                customer: string;
                service: string;
                date: string;
                time: string;
                status: string;
              }) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-pink rounded-full p-2">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.customer}</p>
                      <p className="text-sm text-gray-600">{appointment.service}</p>
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
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{appointment.date}</p>
                    <p className="text-sm text-gray-600">{appointment.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 