'use client';

import { useState } from 'react';
import { Plus, Folder, Package } from 'lucide-react';
import ProductsTable from '../ProductsTable';
import CategoriesTable from '../CategoriesTable';
import AddCategoryModal from '../AddCategoryModal';
import EditProductModal from '../EditProductModal';
import ViewProductModal from '../ViewProductModal';
import { Database } from '../../types/database';

type ProductCategory = Database['public']['Tables']['product_categories']['Row'];
type ProductWithImages = Database['public']['Tables']['products']['Row'] & {
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

interface ProductsProps {
  isAddProductModalOpen: boolean;
  setIsAddProductModalOpen: (open: boolean) => void;
  refreshTrigger: number;
  onProductUpdated?: () => void;
}

export default function Products({ 
  setIsAddProductModalOpen, 
  refreshTrigger,
  onProductUpdated
}: ProductsProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isViewProductModalOpen, setIsViewProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductWithImages | null>(null);

  const handleCategoryAdded = () => {
    // Refresh categories table
  };

  const handleCloseCategoryModal = () => {
    setIsAddCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleEditProduct = (product: ProductWithImages) => {
    setSelectedProduct(product);
    setIsEditProductModalOpen(true);
  };

  const handleViewProduct = (product: ProductWithImages) => {
    setSelectedProduct(product);
    setIsViewProductModalOpen(true);
  };

  const handleProductUpdated = () => {
    // Refresh products table
    console.log('Product updated successfully');
    onProductUpdated?.();
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Package className="h-4 w-4" />
              <span>Produits</span>
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
          {activeTab === 'products' ? (
            // Products Management
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Gestion des Produits</h3>
                <button 
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un Produit
                </button>
              </div>
              <ProductsTable 
                refreshTrigger={refreshTrigger}
                onEditProduct={handleEditProduct}
                onViewProduct={handleViewProduct}
              />
            </div>
          ) : (
            // Categories Management
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Gestion des Catégories</h3>
                <button 
                  onClick={() => setIsAddCategoryModalOpen(true)}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une Catégorie
                </button>
              </div>
              <CategoriesTable />
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        onCategoryAdded={handleCategoryAdded}
        editingCategory={editingCategory}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={isEditProductModalOpen}
        onClose={() => setIsEditProductModalOpen(false)}
        product={selectedProduct}
        onProductUpdated={handleProductUpdated}
      />

      {/* View Product Modal */}
      <ViewProductModal
        isOpen={isViewProductModalOpen}
        onClose={() => setIsViewProductModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
} 