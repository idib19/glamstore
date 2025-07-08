'use client';

import { useState } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import AddProductModal from '../../components/AddProductModal';
import ProductsTable from '../../components/ProductsTable';

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
  TrendingUp
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

  const services = [
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

  const handleProductAdded = () => {
    // Increment refresh trigger to force table refresh
    setRefreshTrigger(prev => prev + 1);
    console.log('Product added successfully - refreshing table');
  };

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
                  <button className="btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un Service
                  </button>
                </div>
                <div className="p-6">
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
                        {services.map((service) => (
                          <tr key={service.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{service.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{service.category}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{service.price}€</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{service.duration}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-primary-pink hover:text-dark-pink">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Gestion des Commandes</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900">Commande #{order.id}</h4>
                            <p className="text-sm text-gray-600">Client: {order.customer}</p>
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
                        <div className="flex space-x-2">
                          <button className="btn-secondary text-sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Voir détails
                          </button>
                          <button className="btn-primary text-sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier statut
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Gestion des Rendez-vous</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentAppointments.map((appointment) => (
                      <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-medium text-gray-900">RDV #{appointment.id}</h4>
                            <p className="text-sm text-gray-600">Client: {appointment.customer}</p>
                            <p className="text-sm text-gray-600">Service: {appointment.service}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{appointment.date}</p>
                            <p className="text-sm text-gray-600">{appointment.time}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="btn-secondary text-sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Voir détails
                          </button>
                          <button className="btn-primary text-sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
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

      <Footer />
    </div>
  );
} 