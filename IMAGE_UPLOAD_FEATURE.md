# Image Upload Feature for Products

## Overview
The AddProductModal component now includes comprehensive image upload functionality using Supabase Storage. Users can upload multiple images for each product, with the first image automatically set as the primary image.

## Features

### Image Upload Capabilities
- **Multiple Image Selection**: Users can select multiple images at once
- **Drag & Drop Support**: Intuitive drag and drop interface for easy image upload
- **File Validation**: Automatic validation of file types (images only) and file sizes
- **Preview Functionality**: Real-time preview of selected images before upload
- **Primary Image Selection**: First uploaded image is automatically marked as primary
- **Image Removal**: Users can remove individual images before upload

### Technical Specifications
- **Supported Formats**: PNG, JPG, GIF
- **File Size Limit**: 5MB per image, 25MB total
- **Storage Bucket**: `produitsimages` in Supabase Storage
- **Database Integration**: Images are stored in the `product_images` table

## Implementation Details

### Storage API (`lib/supabase.ts`)
```typescript
export const storageApi = {
  uploadProductImage: async (file: File, fileName: string) => { ... },
  getPublicUrl: (path: string) => { ... },
  deleteImage: async (path: string) => { ... }
}
```

### Product Images API (`lib/supabase.ts`)
```typescript
export const productImagesApi = {
  create: async (imageData: Database['public']['Tables']['product_images']['Insert']) => { ... },
  getByProductId: async (productId: string) => { ... },
  delete: async (id: string) => { ... }
}
```

### Database Schema
The `product_images` table includes:
- `id`: Unique identifier
- `product_id`: Foreign key to products table
- `image_url`: Public URL from Supabase Storage
- `alt_text`: Alt text for accessibility
- `is_primary`: Boolean flag for primary image
- `sort_order`: Order for image display
- `created_at`: Timestamp

## User Interface

### Upload Area
- Drag and drop zone with visual feedback
- Click to browse files option
- File type and size restrictions clearly displayed
- Loading states during upload

### Image Preview
- Grid layout showing selected images
- Remove button on hover for each image
- Primary image indicator
- Responsive design for different screen sizes

### Validation & Error Handling
- File type validation (images only)
- File size validation (5MB per file, 25MB total)
- Error messages in French
- Graceful error handling with user feedback

## Usage

### Adding Images to a Product
1. Open the AddProductModal
2. Fill in product details
3. In the "Images du Produit" section:
   - Click the upload area or drag images
   - Select one or more image files
   - Review previews and remove if needed
   - First image will be marked as primary
4. Submit the form
5. Images will be uploaded to Supabase Storage
6. Image records will be created in the database

### File Naming Convention
Images are automatically renamed using the pattern: `{timestamp}-{original-filename}` to ensure uniqueness.

## Security Considerations
- File type validation prevents malicious uploads
- File size limits prevent abuse
- Images are stored in a dedicated bucket with proper permissions
- Public URLs are generated for easy access

## Future Enhancements
- Image compression before upload
- Image cropping and editing tools
- Bulk image upload for multiple products
- Image optimization for different screen sizes
- Image metadata extraction (EXIF data)

## Troubleshooting

### Common Issues
1. **Upload Fails**: Check file size and type restrictions
2. **Images Not Displaying**: Verify Supabase Storage bucket permissions
3. **Slow Upload**: Large files may take time; consider image compression

### Error Messages
- "Veuillez sélectionner uniquement des fichiers image" - Invalid file type
- "La taille du fichier ne doit pas dépasser 5MB" - File too large
- "La taille totale des images ne doit pas dépasser 25MB" - Total size limit exceeded
- "Erreur lors du téléchargement des images" - Upload process failed 