import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import Input from '../form/input/InputField';
import TextArea from '../form/input/TextArea';
import FileInput from '../form/input/FileInput';
import Select from '../form/Select';
import { useCreateSubcategoryMutation, useUpdateSubcategoryMutation } from '../../store/slices/api';
import { useGetCategoriesQuery } from '../../store/slices/api';
import { Subcategory } from '../../store/types';
import { getImageUrl } from '../../config/api';

interface AddSubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editSubcategory?: Subcategory | null;
}

const AddSubcategoryModal: React.FC<AddSubcategoryModalProps> = ({ isOpen, onClose, editSubcategory }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImageError, setExistingImageError] = useState(false);

  const [createSubcategory] = useCreateSubcategoryMutation();
  const [updateSubcategory] = useUpdateSubcategoryMutation();
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();

  const isEditMode = !!editSubcategory;

  // Transform categories for Select component
  const categoryOptions = categories.map(category => ({
    value: category._id,
    label: category.name
  }));

  // Prefill form data when editing
  useEffect(() => {
    if (editSubcategory && isOpen) {
      setFormData({
        name: editSubcategory.name,
        description: editSubcategory.description,
        category: editSubcategory.category._id,
        image: null,
      });
      
      // Set existing image preview
      if (editSubcategory.image) {
        setImagePreview(getImageUrl(editSubcategory.image));
      }
      setExistingImageError(false); // Reset error state
    } else if (!editSubcategory && isOpen) {
      // Reset form for create mode
      setFormData({ name: '', description: '', category: '', image: null });
      setImagePreview(null);
      setExistingImageError(false);
    }
    setErrors({});
  }, [editSubcategory, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
    // Clear error when user selects category
    if (errors.category) {
      setErrors(prev => ({ ...prev, category: '' }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create immediate preview URL using URL.createObjectURL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Clear error
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
    } else {
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Subcategory name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Parent category is required';
    }

    // Image is required only for create mode
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
      submitFormData.append('category', formData.category);
      if (formData.image) {
        submitFormData.append('image', formData.image);
      }

      if (isEditMode && editSubcategory) {
        await updateSubcategory({ id: editSubcategory._id, data: submitFormData }).unwrap();
      } else {
        await createSubcategory(submitFormData).unwrap();
      }
      
      // Reset form and close modal
      setFormData({ name: '', description: '', category: '', image: null });
      setImagePreview(null);
      setErrors({});
      onClose();
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} subcategory:`, error);
      setErrors({ submit: `Failed to ${isEditMode ? 'update' : 'create'} subcategory. Please try again.` });
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
      setFormData({ name: '', description: '', category: '', image: null });
      setImagePreview(null);
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-md mx-4 max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {isEditMode ? 'Edit Subcategory' : 'Add New Subcategory'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subcategory Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subcategory Name
            </label>
            <Input
              type="text"
              placeholder="Enter subcategory name"
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
              placeholder="Enter subcategory description"
              rows={4}
              value={formData.description}
              onChange={(value) => handleInputChange('description', value)}
              error={!!errors.description}
              hint={errors.description}
              disabled={isSubmitting}
            />
          </div>

          {/* Parent Category Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Parent Category
            </label>
            <Select
              options={categoryOptions}
              placeholder="Select parent category"
              onChange={handleCategoryChange}
              defaultValue={formData.category}
              className={errors.category ? 'border-red-500' : ''}
            />
            {errors.category && (
              <p className="mt-1.5 text-xs text-red-500">{errors.category}</p>
            )}
            {categoriesLoading && (
              <p className="mt-1.5 text-xs text-gray-500">Loading categories...</p>
            )}
          </div>

          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subcategory Image {isEditMode && '(optional)'}
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
          {(imagePreview || (isEditMode && editSubcategory?.image) || formData.image) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {formData.image ? 'New Image Preview' : (isEditMode && !formData.image ? 'Current Image' : 'Preview')}
              </label>
              <div className="w-24 h-24 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                {(() => {
                  // If there's a new image preview (from file selection), show it
                  if (imagePreview && formData.image) {
                    return (
                      <img
                        src={imagePreview}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={() => {
                          console.error('New image failed to load:', imagePreview);
                        }}
                      />
                    );
                  }

                  // For edit mode, show existing image or "No Image Available"
                  if (isEditMode && editSubcategory?.image) {
                    if (existingImageError) {
                      return (
                        <div className="w-full h-full bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
                          <svg className="w-8 h-8 mb-2 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      );
                    } else {
                      return (
                        <img
                          src={getImageUrl(editSubcategory.image)}
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

                  // If formData.image exists but no preview yet
                  if (formData.image) {
                    return (
                      <div className="w-full h-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    );
                  }

                  // Fallback skeleton
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
              disabled={isSubmitting || categoriesLoading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Subcategory' : 'Create Subcategory')}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddSubcategoryModal;