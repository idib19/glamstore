'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Folder, Settings, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { servicesApi } from '../../lib/supabase';
import ConfirmDialog from '../ConfirmDialog';
import ServiceCategoriesTable from '../ServiceCategoriesTable';
import AddServiceCategoryModal from '../AddServiceCategoryModal';
import { Database } from '../../types/database';

type ServiceCategory = Database['public']['Tables']['service_categories']['Row'];

interface Service {
  id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  price: number;
  duration_minutes: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  service_categories?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface ServicesProps {
  onAddService: () => void;
  onEditService: (service: Service) => void;
  refreshTrigger?: number;
}

export default function Services({ onAddService, onEditService, refreshTrigger }: ServicesProps) {
  const [activeTab, setActiveTab] = useState<'services' | 'categories'>('services');
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddServiceCategoryModalOpen, setIsAddServiceCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  
  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Load services data
  const loadServices = async () => {
    try {
      setIsLoading(true);
      const data = await servicesApi.getAll();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'services') {
      loadServices();
    }
  }, [activeTab, refreshTrigger]);

  // Service actions
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

  // Category actions
  const handleCategoryAdded = () => {
    // Refresh categories table
  };

  const handleCloseCategoryModal = () => {
    setIsAddServiceCategoryModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('services')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'services'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Services</span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Folder className="h-4 w-4" />
              <span>Catégories</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'services' ? (
            // Services Management
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Gestion des Services</h3>
                <button 
                  onClick={onAddService}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un Service
                </button>
              </div>
              
              {isLoading ? (
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
                          Image
                        </th>
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
                          <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                            Aucun service trouvé
                          </td>
                        </tr>
                      ) : (
                        services.map((service) => (
                          <tr key={service.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {service.image_url ? (
                                  <Image
                                    src={service.image_url}
                                    alt={service.name}
                                    width={48}
                                    height={48}
                                    className="h-12 w-12 object-cover rounded-lg border border-gray-200"
                                  />
                                ) : (
                                  <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <ImageIcon className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                            </td>
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
                                  onClick={() => onEditService(service)}
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
          ) : (
            // Service Categories Management
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Gestion des Catégories de Services</h3>
                <button 
                  onClick={() => setIsAddServiceCategoryModalOpen(true)}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une Catégorie
                </button>
              </div>
              <ServiceCategoriesTable />
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />

      {/* Add Service Category Modal */}
      <AddServiceCategoryModal
        isOpen={isAddServiceCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        onCategoryAdded={handleCategoryAdded}
        editingCategory={editingCategory}
      />
    </>
  );
} 