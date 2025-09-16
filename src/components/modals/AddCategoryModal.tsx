import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import Input from '../form/input/InputField';
import TextArea from '../form/input/TextArea';
import FileInput from '../form/input/FileInput';
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '../../store/slices/api';
import { getImageUrl } from '../../config/api';

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  videoCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editCategory?: Category | null;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  editCategory = null
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, ] = useState<string>('No file selected');
  const [existingImageError, setExistingImageError] = useState(false);

  console.log('Component render - imagePreview:', imagePreview);
  console.log('Component render - formData.image:', formData.image);
  console.log('Component render - debugInfo:', debugInfo);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const isEditMode = !!editCategory;

  // Prefill form data when editing
  useEffect(() => {
    if (editCategory) {
      setFormData({
        name: editCategory.name,
        description: editCategory.description,
        image: null, // File will be null for existing image
      });
      // Set existing image preview
      if (editCategory.image) {
        setImagePreview(getImageUrl(editCategory.image));
      }
      setExistingImageError(false); // Reset error state
    } else {
      // Reset form for create mode
      setFormData({ name: '', description: '', image: null });
      setImagePreview(null);
      setExistingImageError(false);
    }
    setErrors({});
  }, [editCategory, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('=== handleFileChange called ===');
    const file = event.target.files?.[0];
    console.log('File selected:', file);
    console.log('Current imagePreview state:', imagePreview);
    console.log('Current formData.image:', formData.image);

    if (file) {
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      setFormData(prev => {
        console.log('Setting formData with image:', file);
        return { ...prev, image: file };
      });

      // Create immediate preview URL using URL.createObjectURL
      const previewUrl = URL.createObjectURL(file);
      console.log('Preview URL created:', previewUrl);

      setImagePreview(previewUrl);
      console.log('setImagePreview called with:', previewUrl);

      // Clear error
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    } else {
      console.log('No file selected, clearing preview');
      setImagePreview(null);
    }

    console.log('=== handleFileChange completed ===');
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // For create mode, image is required. For edit mode, it's optional
    if (!isEditMode && !formData.image) {
      newErrors.image = 'Image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name.trim());
      submitFormData.append('description', formData.description.trim());

      // Only append image if a new file is selected
      if (formData.image) {
        submitFormData.append('image', formData.image);
      }

      if (isEditMode && editCategory) {
        await updateCategory({
          id: editCategory._id,
          data: submitFormData
        }).unwrap();
      } else {
        await createCategory(submitFormData).unwrap();
      }

      // Reset form and close modal
      setFormData({ name: '', description: '', image: null });
      setImagePreview(null);
      setErrors({});
      onClose();
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} category:`, error);
      setErrors({
        submit: `Failed to ${isEditMode ? 'update' : 'create'} category. Please try again.`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup object URLs when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleClose = () => {
    if (!isSubmitting) {
      // Cleanup object URL before closing
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      setFormData({ name: '', description: '', image: null });
      setImagePreview(null);
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md mx-4">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {isEditMode ? 'Edit Category' : 'Add New Category'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Name
            </label>
            <Input
              type="text"
              placeholder="Enter category name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              hint={errors.name}
              disabled={isSubmitting}
            />
          </div>

          {/* Description TextArea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <TextArea
              placeholder="Enter category description"
              rows={4}
              value={formData.description}
              onChange={(value) => handleInputChange('description', value)}
              error={!!errors.description}
              hint={errors.description}
              disabled={isSubmitting}
            />
          </div>

          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Image {isEditMode && '(optional)'}
            </label>
            <FileInput
              onChange={handleFileChange}
              accept="image/*"
              className={errors.image ? 'border-red-500' : ''}
            />
            {errors.image && (
              <p className="mt-1.5 text-xs text-red-500">{errors.image}</p>
            )}
          </div>

          {/* Image Preview */}
          {(imagePreview || (isEditMode && editCategory?.image) || formData.image) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {formData.image ? 'New Image Preview' : (isEditMode && !formData.image ? 'Current Image' : 'Preview')}
              </label>
              <div className="w-24 h-24 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                {(() => {
                  console.log('Render decision:', {
                    imagePreview,
                    hasFormDataImage: !!formData.image,
                    isEditMode,
                    hasEditCategoryImage: !!(editCategory?.image),
                    existingImageError
                  });

                  // If there's a new image preview (from file selection), show it
                  if (imagePreview && formData.image) {
                    console.log('Rendering new image preview:', imagePreview);
                    return (
                      <img
                        src={imagePreview}
                        alt=""
                        className="w-full h-full object-cover"
                        onLoad={() => console.log('New image loaded successfully')}
                        onError={(_e) => {
                          console.error('New image failed to load:', imagePreview);
                        }}
                      />
                    );
                  }

                  // For edit mode, show existing image or "No Image Available"
                  if (isEditMode && editCategory?.image) {
                    if (existingImageError) {
                      console.log('Showing no image message due to error');
                      return (
                        <div className="w-full h-full bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
                          <svg className="w-8 h-8 mb-2 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      );
                    } else {
                      console.log('Rendering existing category image');
                      return (
                        <img
                          src={getImageUrl(editCategory.image)}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={() => {
                            console.error('Existing image failed to load, showing no image message');
                            setExistingImageError(true);
                          }}
                        />
                      );
                    }
                  }

                  // If formData.image exists but no preview yet (shouldn't happen with new logic)
                  if (formData.image) {
                    console.log('Rendering loading state for formData.image');
                    return (
                      <div className="w-full h-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    );
                  }

                  console.log('Rendering skeleton fallback');
                  return (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="text-red-500 text-sm">{errors.submit}</div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? (isEditMode ? 'Updating...' : 'Creating...')
                : (isEditMode ? 'Update Category' : 'Create Category')
              }
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddCategoryModal;