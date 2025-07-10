'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Plus, Upload, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { productsApi, categoriesApi, storageApi, productImagesApi } from '../lib/supabase';
import { Database } from '../types/database';
import { generateSKU } from '../lib/utils';

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

interface ImageFile {
  file: File;
  preview: string;
  name: string;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductWithImages | null;
  onProductUpdated: () => void;
}

export default function EditProductModal({ isOpen, onClose, product, onProductUpdated }: EditProductModalProps) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [existingImages, setExistingImages] = useState<{
    id: string;
    image_url: string;
    alt_text: string | null;
    is_primary: boolean;
    sort_order: number;
  }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    description: '',
    category_id: '',
    price: '',
    sale_price: '',
    sku: '',
    brand: '',
    in_stock: true,
    is_featured: false
  });

  // Validation state
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoriesApi.getAll();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Erreur lors du chargement des catégories');
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Populate form when product changes
  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name || '',
        short_description: product.short_description || '',
        description: product.description || '',
        category_id: product.category_id || '',
        price: product.price?.toString() || '',
        sale_price: product.sale_price?.toString() || '',
        sku: product.sku || '',
        brand: product.brand || '',
        in_stock: product.in_stock ?? true,
        is_featured: product.is_featured ?? false
      });
      setExistingImages(product.product_images || []);
      setSelectedImages([]);
      setErrors({});
      setError(null);
      setSuccess(false);
    }
  }, [product, isOpen]);

  // Generate SKU when category changes
  useEffect(() => {
    if (formData.category_id && !formData.sku) {
      const selectedCategory = categories.find(cat => cat.id === formData.category_id);
      if (selectedCategory) {
        const generatedSku = generateSKU(selectedCategory.name);
        setFormData(prev => ({
          ...prev,
          sku: generatedSku
        }));
      }
    }
  }, [formData.category_id, categories, formData.sku]);

  // Cleanup image previews on unmount
  useEffect(() => {
    return () => {
      selectedImages.forEach(image => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, [selectedImages]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du produit est requis';
    }

    if (!formData.short_description.trim()) {
      newErrors.short_description = 'La description courte est requise';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'La catégorie est requise';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0';
    }

    if (formData.sale_price && parseFloat(formData.sale_price) >= parseFloat(formData.price)) {
      newErrors.sale_price = 'Le prix de vente doit être inférieur au prix normal';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'Le SKU est requis';
    }

    // Validate images if any are selected
    if (selectedImages.length > 0) {
      const totalSize = selectedImages.reduce((total, image) => total + image.file.size, 0);
      if (totalSize > 25 * 1024 * 1024) { // 25MB total limit
        newErrors.images = `La taille totale des images (${(totalSize / (1024 * 1024)).toFixed(1)}MB) dépasse la limite de 25MB. Supprimez quelques images ou choisissez des fichiers plus petits.`;
      }
      
      // Validate number of images
      if (selectedImages.length > 10) {
        newErrors.images = `Trop d'images sélectionnées (${selectedImages.length}). Maximum autorisé: 10 images.`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product || !validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const productData = {
        name: formData.name.trim(),
        short_description: formData.short_description.trim(),
        description: formData.description.trim() || null,
        category_id: formData.category_id || null,
        price: parseFloat(formData.price),
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        sku: formData.sku.trim(),
        brand: formData.brand.trim() || null,
        in_stock: formData.in_stock,
        is_featured: formData.is_featured
      };

      await productsApi.update(product.id, productData);
      
      // Upload new images if any are selected
      if (selectedImages.length > 0) {
        await uploadImages(product.id);
      }
      
      setSuccess(true);
      
      // Call the callback immediately to refresh the table
      onProductUpdated();
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      console.error('Error updating product:', err);
      console.error('Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        error: err
      });
      setError(`Erreur lors de la mise à jour du produit: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
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

  const handleGenerateSKU = () => {
    const selectedCategory = categories.find(cat => cat.id === formData.category_id);
    if (selectedCategory) {
      const newSku = generateSKU(selectedCategory.name);
      setFormData(prev => ({
        ...prev,
        sku: newSku
      }));
    }
  };

  // Image handling functions
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: ImageFile[] = [];
    const errors: string[] = [];
    
    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        errors.push(`"${file.name}" n'est pas un fichier image valide`);
        return;
      }

      // Validate specific image formats
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        errors.push(`"${file.name}" a un format non supporté. Formats acceptés: PNG, JPG, JPEG, GIF, WEBP`);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`"${file.name}" est trop volumineux (${(file.size / (1024 * 1024)).toFixed(1)}MB). Taille maximum: 5MB`);
        return;
      }

      // Validate minimum file size (prevent empty or corrupted files)
      if (file.size < 1024) { // Less than 1KB
        errors.push(`"${file.name}" semble être vide ou corrompu (${file.size} bytes)`);
        return;
      }

      const preview = URL.createObjectURL(file);
      const name = `${Date.now()}-${file.name}`;
      
      newImages.push({
        file,
        preview,
        name
      });
    });

    // Display errors if any
    if (errors.length > 0) {
      setError(`Erreurs de validation: ${errors.join('; ')}`);
      return;
    }

    setSelectedImages(prev => [...prev, ...newImages]);
    setError(null);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const removeExistingImage = async (imageId: string) => {
    try {
      await productImagesApi.delete(imageId);
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
    } catch (err) {
      console.error('Error removing existing image:', err);
      setError('Erreur lors de la suppression de l\'image');
    }
  };

  const uploadImages = async (productId: string) => {
    if (selectedImages.length === 0) return;

    setUploadingImages(true);
    
    try {
      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];
        
        // Upload to storage
        await storageApi.uploadProductImage(image.file, image.name);
        
        // Get public URL
        const publicUrl = storageApi.getPublicUrl(image.name);
        
        // Create image record in database
        await productImagesApi.create({
          product_id: productId,
          image_url: publicUrl,
          alt_text: `${formData.name} - Image ${i + 1}`,
          is_primary: existingImages.length === 0 && i === 0, // First image is primary if no existing images
          sort_order: existingImages.length + i
        });
      }
    } catch (err) {
      console.error('Error uploading images:', err);
      setError(`Erreur lors du téléchargement des images: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-primary-pink', 'bg-pink-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary-pink', 'bg-pink-50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary-pink', 'bg-pink-50');
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setError('Veuillez déposer uniquement des fichiers image valides (PNG, JPG, JPEG, GIF, WEBP)');
      return;
    }

    const newImages: ImageFile[] = [];
    const errors: string[] = [];
    
    imageFiles.forEach((file) => {
      // Validate specific image formats
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        errors.push(`"${file.name}" a un format non supporté. Formats acceptés: PNG, JPG, JPEG, GIF, WEBP`);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`"${file.name}" est trop volumineux (${(file.size / (1024 * 1024)).toFixed(1)}MB). Taille maximum: 5MB`);
        return;
      }

      // Validate minimum file size (prevent empty or corrupted files)
      if (file.size < 1024) { // Less than 1KB
        errors.push(`"${file.name}" semble être vide ou corrompu (${file.size} bytes)`);
        return;
      }

      const preview = URL.createObjectURL(file);
      const name = `${Date.now()}-${file.name}`;
      
      newImages.push({
        file,
        preview,
        name
      });
    });

    // Display errors if any
    if (errors.length > 0) {
      setError(`Erreurs de validation: ${errors.join('; ')}`);
      return;
    }

    setSelectedImages(prev => [...prev, ...newImages]);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Modifier le Produit
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-700">Produit mis à jour avec succès !</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Form */}
        {!product ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-pink mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du produit...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du Produit *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ex: Lip Gloss Ultra Hydratant"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => handleInputChange('category_id', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent ${
                  errors.category_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
              )}
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description Courte *
              </label>
              <input
                type="text"
                value={formData.short_description}
                onChange={(e) => handleInputChange('short_description', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent ${
                  errors.short_description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Description courte pour l'affichage"
              />
              {errors.short_description && (
                <p className="mt-1 text-sm text-red-600">{errors.short_description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description Complète
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                placeholder="Description détaillée du produit..."
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix Normal (CAD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix de Vente (CAD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.sale_price}
                onChange={(e) => handleInputChange('sale_price', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent ${
                  errors.sale_price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.sale_price && (
                <p className="mt-1 text-sm text-red-600">{errors.sale_price}</p>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent ${
                    errors.sku ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: QG-LG-001"
                />
                <button
                  type="button"
                  onClick={handleGenerateSKU}
                  disabled={!formData.category_id}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  title="Générer un SKU"
                >
                  ✨
                </button>
              </div>
              {errors.sku && (
                <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
              )}
              {formData.category_id && (
                <p className="mt-1 text-xs text-gray-500">
                  Cliquez sur ✨ pour générer un SKU basé sur la catégorie
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marque
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                placeholder="Ex: Queen's Glam"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images du Produit
              </label>
              {errors.images && (
                <p className="mt-1 text-sm text-red-600">{errors.images}</p>
              )}
              <div className="space-y-4">
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">
                      Images existantes ({existingImages.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {existingImages.map((image, index) => (
                        <div key={image.id} className="relative group">
                          <Image
                            src={image.image_url}
                            alt={image.alt_text || `Image ${index + 1}`}
                            width={96}
                            height={96}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            loading="lazy"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(image.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          {image.is_primary && (
                            <div className="absolute top-1 left-1 bg-primary-pink text-white text-xs px-2 py-1 rounded">
                              Principal
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* File Input */}
                <div className="flex items-center justify-center w-full">
                  <label 
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG, GIF, WEBP • Max 5MB par fichier • Max 10 images</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Selected Images Preview */}
                {selectedImages.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">
                      Nouvelles images sélectionnées ({selectedImages.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            width={96}
                            height={96}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            loading="lazy"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          {existingImages.length === 0 && index === 0 && (
                            <div className="absolute top-1 left-1 bg-primary-pink text-white text-xs px-2 py-1 rounded">
                              Principal
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {uploadingImages && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-pink"></div>
                    <span>Téléchargement des images...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.in_stock}
                onChange={(e) => handleInputChange('in_stock', e.target.checked)}
                className="h-4 w-4 text-primary-pink focus:ring-primary-pink border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">En stock</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                className="h-4 w-4 text-primary-pink focus:ring-primary-pink border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Produit en vedette</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImages}
              className="px-6 py-2 bg-primary-pink text-white rounded-lg hover:bg-dark-pink transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading || uploadingImages ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {uploadingImages ? 'Téléchargement des images...' : 'Mise à jour en cours...'}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Mettre à Jour le Produit
                </>
              )}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
} 