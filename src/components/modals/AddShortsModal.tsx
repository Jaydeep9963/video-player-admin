import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import Input from '../form/input/InputField';
import TextArea from '../form/input/TextArea';
import FileInput from '../form/input/FileInput';
import Select from '../form/Select';
import { useCreateShortMutation, useUpdateShortMutation } from '../../store/slices/api';
import { Short } from '../../store/types';
import { getImageUrl } from '../../config/api';

interface AddShortsModalProps {
  isOpen: boolean;
  onClose: () => void;
  editShort?: Short | null;
}

const AddShortsModal: React.FC<AddShortsModalProps> = ({ isOpen, onClose, editShort }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform: 'upload',
    youtubeUrl: '',
    thumbnail: null as File | null,
    shorts: null as File | null,
  });
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingThumbnailError, setExistingThumbnailError] = useState(false);

  console.log('Component render - thumbnailPreview:', thumbnailPreview);
  console.log('Component render - formData.thumbnail:', formData.thumbnail);

  const [createShort] = useCreateShortMutation();
  const [updateShort] = useUpdateShortMutation();

  const isEditMode = !!editShort;

  // Prefill form data when editing
  useEffect(() => {
    if (editShort) {
      setFormData({
        title: editShort.title,
        description: editShort.description,
        platform: editShort.platform,
        youtubeUrl: editShort.youtubeUrl || '',
        thumbnail: null, // File will be null for existing thumbnail
        shorts: null,
      });
      
      // Set existing thumbnail preview
      if (editShort.thumbnailPath) {
        setThumbnailPreview(getImageUrl(editShort.thumbnailPath));
      }
      setExistingThumbnailError(false); // Reset error state
    } else {
      // Reset form for create mode
      setFormData({
        title: '',
        description: '',
        platform: 'upload',
        youtubeUrl: '',
        thumbnail: null,
        shorts: null,
      });
      setThumbnailPreview(null);
      setExistingThumbnailError(false);
    }
    setErrors({});
  }, [editShort, isOpen]);

  // Reset shorts file/URL when platform changes
  useEffect(() => {
    if (!isEditMode) {
      setFormData(prev => ({ 
        ...prev, 
        shorts: null,
        youtubeUrl: ''
      }));
      // Clear related errors
      setErrors(prev => ({ 
        ...prev, 
        shorts: '', 
        youtubeUrl: '' 
      }));
    }
  }, [formData.platform, isEditMode]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('=== handleThumbnailChange called ===');
    const file = event.target.files?.[0];
    console.log('File selected:', file);
    console.log('Current thumbnailPreview state:', thumbnailPreview);
    console.log('Current formData.thumbnail:', formData.thumbnail);

    if (file) {
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      setFormData(prev => {
        console.log('Setting formData with thumbnail:', file);
        return { ...prev, thumbnail: file };
      });

      // Create immediate preview URL using URL.createObjectURL
      const previewUrl = URL.createObjectURL(file);
      console.log('Preview URL created:', previewUrl);

      setThumbnailPreview(previewUrl);
      console.log('setThumbnailPreview called with:', previewUrl);
      
      // Clear error
      if (errors.thumbnail) {
        setErrors(prev => ({ ...prev, thumbnail: '' }));
      }
    } else {
      console.log('No file selected, clearing preview');
      setThumbnailPreview(null);
    }

    console.log('=== handleThumbnailChange completed ===');
  };

  const handleShortsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, shorts: file }));
      
      // Clear error
      if (errors.shorts) {
        setErrors(prev => ({ ...prev, shorts: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Short title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Video file/URL validation only for create mode
    if (!isEditMode) {
      if (formData.platform === 'upload' && !formData.shorts) {
        newErrors.shorts = 'Short video file is required';
      }

      if (formData.platform === 'youtube' && !formData.youtubeUrl.trim()) {
        newErrors.youtubeUrl = 'YouTube URL is required';
      }

      if (!formData.thumbnail) {
        newErrors.thumbnail = 'Thumbnail is required';
      }
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
      submitFormData.append('title', formData.title.trim());
      submitFormData.append('description', formData.description.trim());
      submitFormData.append('platform', formData.platform);
      
      if (formData.platform === 'youtube' && formData.youtubeUrl) {
        submitFormData.append('youtubeUrl', formData.youtubeUrl.trim());
      } else if (formData.shorts) {
        submitFormData.append('shorts', formData.shorts);
      }
      
      // Only append thumbnail if a new file is selected
      if (formData.thumbnail) {
        submitFormData.append('thumbnail', formData.thumbnail);
      }

      if (isEditMode && editShort) {
        await updateShort({ id: editShort._id, data: submitFormData }).unwrap();
      } else {
        await createShort(submitFormData).unwrap();
      }
      
      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        platform: 'upload',
        youtubeUrl: '',
        thumbnail: null,
        shorts: null,
      });
      setThumbnailPreview(null);
      setErrors({});
      onClose();
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} short:`, error);
      setErrors({ submit: `Failed to ${isEditMode ? 'update' : 'create'} short. Please try again.` });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup object URLs when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const handleClose = () => {
    if (!isSubmitting) {
      // Cleanup object URL before closing
      if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      setFormData({
        title: '',
        description: '',
        platform: 'upload',
        youtubeUrl: '',
        thumbnail: null,
        shorts: null,
      });
      setThumbnailPreview(null);
      setErrors({});
      onClose();
    }
  };

  // Platform options
  const platformOptions = [
    { value: 'upload', label: 'Upload' },
    { value: 'youtube', label: 'YouTube' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-2xl mx-4">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {isEditMode ? 'Edit Short' : 'Add New Short'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Short Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Short Title
            </label>
            <Input
              type="text"
              placeholder="Enter short title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={!!errors.title}
              hint={errors.title}
              disabled={isSubmitting}
            />
          </div>

          {/* Description TextArea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <TextArea
              placeholder="Enter short description"
              rows={4}
              value={formData.description}
              onChange={(value) => handleInputChange('description', value)}
              error={!!errors.description}
              hint={errors.description}
              disabled={isSubmitting}
            />
          </div>

          {/* Platform Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Platform
            </label>
            <Select
              options={platformOptions}
              placeholder="Select Platform"
              onChange={(value) => handleInputChange('platform', value)}
              defaultValue={formData.platform}
            />
          </div>

          {/* Conditional Video Input - YouTube URL or File Upload */}
          {formData.platform === 'youtube' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                YouTube URL {isEditMode && '(Optional)'}
              </label>
              <Input
                type="url"
                placeholder="Enter YouTube short URL"
                value={formData.youtubeUrl}
                onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                error={!!errors.youtubeUrl}
                hint={errors.youtubeUrl}
                disabled={isSubmitting}
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Short Video File {isEditMode && '(Optional)'}
              </label>
              <FileInput
                onChange={handleShortsChange}
                className={errors.shorts ? 'border-red-500' : ''}
                accept="video/*"
              />
              {errors.shorts && (
                <p className="mt-1.5 text-xs text-red-500">{errors.shorts}</p>
              )}
            </div>
          )}

          {/* Thumbnail File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Short Thumbnail {isEditMode && '(optional)'}
            </label>
            <FileInput
              onChange={handleThumbnailChange}
              className={errors.thumbnail ? 'border-red-500' : ''}
              accept="image/*"
            />
            {errors.thumbnail && (
              <p className="mt-1.5 text-xs text-red-500">{errors.thumbnail}</p>
            )}
          </div>

          {/* Thumbnail Preview */}
          {(thumbnailPreview || (isEditMode && editShort?.thumbnailPath) || formData.thumbnail) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {formData.thumbnail ? 'New Thumbnail Preview' : (isEditMode && !formData.thumbnail ? 'Current Thumbnail' : 'Preview')}
              </label>
              <div className="w-24 h-24 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                {(() => {
                  console.log('Render decision:', {
                    thumbnailPreview,
                    hasFormDataThumbnail: !!formData.thumbnail,
                    isEditMode,
                    hasEditShortThumbnail: !!(editShort?.thumbnailPath),
                    existingThumbnailError
                  });

                  // If there's a new thumbnail preview (from file selection), show it
                  if (thumbnailPreview && formData.thumbnail) {
                    console.log('Rendering new thumbnail preview:', thumbnailPreview);
                    return (
                      <img
                        src={thumbnailPreview}
                        alt=""
                        className="w-full h-full object-cover"
                        onLoad={() => console.log('New thumbnail loaded successfully')}
                        onError={(_e) => {
                          console.error('New thumbnail failed to load:', thumbnailPreview);
                        }}
                      />
                    );
                  }

                  // For edit mode, show existing thumbnail or "No Thumbnail Available"
                  if (isEditMode && editShort?.thumbnailPath) {
                    if (existingThumbnailError) {
                      console.log('Showing no thumbnail message due to error');
                      return (
                        <div className="w-full h-full bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
                          <svg className="w-8 h-8 mb-2 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      );
                    } else {
                      console.log('Rendering existing short thumbnail');
                      return (
                        <img
                          src={getImageUrl(editShort.thumbnailPath)}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={() => {
                            console.error('Existing thumbnail failed to load, showing no thumbnail message');
                            setExistingThumbnailError(true);
                          }}
                        />
                      );
                    }
                  }

                  // If formData.thumbnail exists but no preview yet (shouldn't happen with new logic)
                  if (formData.thumbnail) {
                    console.log('Rendering loading state for formData.thumbnail');
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
              {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Short' : 'Create Short')}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddShortsModal;