'use client';

import { Plus } from 'lucide-react';
import ProductsTable from '../ProductsTable';

interface ProductsProps {
  isAddProductModalOpen: boolean;
  setIsAddProductModalOpen: (open: boolean) => void;
  refreshTrigger: number;
}

export default function Products({ 
  isAddProductModalOpen, 
  setIsAddProductModalOpen, 
  refreshTrigger 
}: ProductsProps) {
  return (
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
  );
} 