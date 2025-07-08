'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Plus, AlertCircle, CheckCircle, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { categoriesApi, storageApi } from '../lib/supabase';
import { Database } from '../types/database';

type ProductCategory = Database['public']['Tables']['product_categories']['Row'];

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryAdded: () => void;
  editingCategory?: ProductCategory | null;
}

interface ImageFile {
  file: File;
  preview: string;
  uploaded?: boolean;
  url?: string;
}

export default function AddCategoryModal({ 
  isOpen, 
  onClose, 
  onCategoryAdded, 
  editingCategory 
}: AddCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    image_url: '',
    is_active: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens/closes or when editing category changes
  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        setFormData({
          name: editingCategory.name,
          description: editingCategory.description || '',
          slug: editingCategory.slug,
          image_url: editingCategory.image_url || '',
          is_active: editingCategory.is_active
        });
        if (editingCategory.image_url) {
          setSelectedImage({
            file: new File([], ''),
            preview: editingCategory.image_url,
            uploaded: true,
            url: editingCategory.image_url
          });
        } else {
          setSelectedImage(null);
        }
      } else {
        setFormData({
          name: '',
          description: '',
          slug: '',
          image_url: '',
          is_active: true
        });
        setSelectedImage(null);
      }
      setErrors({});
      setSuccess(false);
    }
  }, [isOpen, editingCategory]);

  // Generate slug from name
  useEffect(() => {
    if (formData.name && !editingCategory) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  }, [formData.name, editingCategory]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Le slug est requis';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Le slug ne peut contenir que des lettres minuscules, chiffres et tirets';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Image handling functions
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        image: 'Veuillez sélectionner un fichier image valide'
      }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        image: 'L\'image ne doit pas dépasser 5MB'
      }));
      return;
    }

    const preview = URL.createObjectURL(file);
    setSelectedImage({ file, preview, uploaded: false });
    setErrors(prev => ({ ...prev, image: '' }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileName = `category-images/${Date.now()}-${file.name}`;
    const data = await storageApi.uploadProductImage(file, fileName);
    
    const publicUrl = storageApi.getPublicUrl(fileName);
    return publicUrl;
  };

  const removeImage = () => {
    if (selectedImage?.preview) {
      URL.revokeObjectURL(selectedImage.preview);
    }
    setSelectedImage(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
    setErrors(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setErrors({});

      let imageUrl = formData.image_url;

      // Upload new image if selected
      if (selectedImage && !selectedImage.uploaded) {
        imageUrl = await uploadImage(selectedImage.file);
      }

      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        slug: formData.slug.trim(),
        image_url: imageUrl || null,
        is_active: formData.is_active
      };

      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, categoryData);
      } else {
        await categoriesApi.create(categoryData);
      }

      setSuccess(true);
      setTimeout(() => {
        onCategoryAdded();
        onClose();
      }, 1500);

    } catch (err: any) {
      console.error('Error saving category:', err);
      setErrors({
        submit: err.message || 'Erreur lors de la sauvegarde de la catégorie'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingCategory ? 'Modifier la Catégorie' : 'Ajouter une Catégorie'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Success Message */}
          {success && (
            <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <p className="text-green-800">
                {editingCategory ? 'Catégorie modifiée avec succès !' : 'Catégorie créée avec succès !'}
              </p>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de la Catégorie
            </label>
            <div className="space-y-4">
              {/* Image Preview */}
              {selectedImage && (
                <div className="relative inline-block">
                  <img
                    src={selectedImage.preview}
                    alt="Preview"
                    className="h-32 w-32 rounded-lg object-cover border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Upload Button */}
              {!selectedImage && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Ajouter une image</p>
                  </div>
                </button>
              )}

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              {errors.image && (
                <p className="text-sm text-red-600">{errors.image}</p>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la Catégorie *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ex: Lip Gloss"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.slug ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ex: lip-gloss"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Le slug sera utilisé dans l'URL de la catégorie
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description optionnelle de la catégorie..."
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
              Catégorie active
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {editingCategory ? 'Modification...' : 'Création...'}
                </div>
              ) : (
                editingCategory ? 'Modifier' : 'Créer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 