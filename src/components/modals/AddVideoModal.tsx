import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/modal';
import Input from '../form/input/InputField';
import TextArea from '../form/input/TextArea';
import FileInput from '../form/input/FileInput';
import Select from '../form/Select';
import { useCreateVideoMutation, useUpdateVideoMutation, useGetCategoriesQuery, useGetSubcategoriesQuery } from '../../store/slices/api';
import { Video } from '../../store/types';
import { getImageUrl } from '../../config/api';

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  editVideo?: Video | null;
}

const AddVideoModal: React.FC<AddVideoModalProps> = ({ isOpen, onClose, editVideo }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    platform: 'upload',
    youtubeUrl: '',
    thumbnail: null as File | null,
    video: null as File | null,
  });
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingThumbnailError, setExistingThumbnailError] = useState(false);

  const [createVideo] = useCreateVideoMutation();
  const [updateVideo] = useUpdateVideoMutation();
  const { data: categories = [] } = useGetCategoriesQuery({});
  const { data: subcategories = [] } = useGetSubcategoriesQuery({
    category: formData.category || undefined
  });

  const isEditMode = !!editVideo;

  // Prefill form data when editing
  useEffect(() => {
    if (editVideo && isOpen) {
      setFormData({
        title: editVideo.title,
        description: editVideo.description,
        category: editVideo.category._id,
        subcategory: editVideo.subcategory._id,
        platform: editVideo.platform,
        youtubeUrl: editVideo.youtubeUrl || '',
        thumbnail: null,
        video: null,
      });
      
      // Set existing thumbnail preview
      if (editVideo.thumbnailPath) {
        setThumbnailPreview(getImageUrl(editVideo.thumbnailPath));
      }
      setExistingThumbnailError(false); // Reset error state
    } else if (!editVideo && isOpen) {
      // Reset form for create mode
      setFormData({
        title: '',
        description: '',
        category: '',
        subcategory: '',
        platform: 'upload',
        youtubeUrl: '',
        thumbnail: null,
        video: null,
      });
      setThumbnailPreview(null);
      setExistingThumbnailError(false);
    }
    setErrors({});
  }, [editVideo, isOpen]);

  // Reset subcategory when category changes
  useEffect(() => {
    if (formData.category && !isEditMode) {
      setFormData(prev => ({ ...prev, subcategory: '' }));
    }
  }, [formData.category, isEditMode]);

  // Reset video file/URL when platform changes
  useEffect(() => {
    if (!isEditMode) {
      setFormData(prev => ({ 
        ...prev, 
        video: null,
        youtubeUrl: ''
      }));
      // Clear related errors
      setErrors(prev => ({ 
        ...prev, 
        video: '', 
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
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (10MB limit for thumbnails)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setErrors(prev => ({ 
          ...prev, 
          thumbnail: 'Thumbnail file size must be less than 10MB' 
        }));
        return;
      }
      
      setFormData(prev => ({ ...prev, thumbnail: file }));
      
      // Create immediate preview URL using URL.createObjectURL
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
      
      // Clear error
      if (errors.thumbnail) {
        setErrors(prev => ({ ...prev, thumbnail: '' }));
      }
    } else {
      setThumbnailPreview(null);
    }
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (500MB limit)
      const maxSize = 500 * 1024 * 1024; // 500MB in bytes
      if (file.size > maxSize) {
        setErrors(prev => ({ 
          ...prev, 
          video: 'Video file size must be less than 500MB' 
        }));
        return;
      }
      
      setFormData(prev => ({ ...prev, video: file }));
      
      // Clear error
      if (errors.video) {
        setErrors(prev => ({ ...prev, video: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Video title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.subcategory) {
      newErrors.subcategory = 'Subcategory is required';
    }

    // Video file/URL validation only for create mode or when changing platform
    if (!isEditMode) {
      if (formData.platform === 'upload' && !formData.video) {
        newErrors.video = 'Video file is required';
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
      submitFormData.append('category', formData.category);
      submitFormData.append('subcategory', formData.subcategory);
      submitFormData.append('platform', formData.platform);
      
      if (formData.platform === 'youtube' && formData.youtubeUrl) {
        submitFormData.append('youtubeUrl', formData.youtubeUrl.trim());
      } else if (formData.video) {
        submitFormData.append('video', formData.video);
      }
      
      if (formData.thumbnail) {
        submitFormData.append('thumbnail', formData.thumbnail);
      }

      if (isEditMode && editVideo) {
        await updateVideo({ id: editVideo._id, data: submitFormData }).unwrap();
      } else {
        await createVideo(submitFormData).unwrap();
      }
      
      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        category: '',
        subcategory: '',
        platform: 'upload',
        youtubeUrl: '',
        thumbnail: null,
        video: null,
      });
      setThumbnailPreview(null);
      setErrors({});
      onClose();
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} video:`, error);
      setErrors({ submit: `Failed to ${isEditMode ? 'update' : 'create'} video. Please try again.` });
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
        category: '',
        subcategory: '',
        platform: 'upload',
        youtubeUrl: '',
        thumbnail: null,
        video: null,
      });
      setThumbnailPreview(null);
      setErrors({});
      onClose();
    }
  };

  // Prepare category options
  const categoryOptions = categories.map(category => ({
    value: category._id,
    label: category.name
  }));

  // Prepare subcategory options
  const subcategoryOptions = subcategories.map(subcategory => ({
    value: subcategory._id,
    label: subcategory.name
  }));

  // Platform options
  const platformOptions = [
    { value: 'upload', label: 'Upload' },
    { value: 'youtube', label: 'YouTube' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {isEditMode ? 'Edit Video' : 'Add New Video'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Video Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Video Title
            </label>
            <Input
              type="text"
              placeholder="Enter video title"
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
              placeholder="Enter video description"
              rows={4}
              value={formData.description}
              onChange={(value) => handleInputChange('description', value)}
              error={!!errors.description}
              hint={errors.description}
              disabled={isSubmitting}
            />
          </div>

          {/* Category and Subcategory - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <Select
                options={categoryOptions}
                placeholder="Select Category"
                onChange={(value) => handleInputChange('category', value)}
                defaultValue={formData.category}
                className={errors.category ? 'border-red-500' : ''}
              />
              {errors.category && (
                <p className="mt-1.5 text-xs text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Subcategory Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subcategory
              </label>
              <Select
                options={subcategoryOptions}
                placeholder="Select Subcategory"
                onChange={(value) => handleInputChange('subcategory', value)}
                defaultValue={formData.subcategory}
                className={errors.subcategory ? 'border-red-500' : ''}
              />
              {errors.subcategory && (
                <p className="mt-1.5 text-xs text-red-500">{errors.subcategory}</p>
              )}
              {!formData.category && (
                <p className="mt-1.5 text-xs text-gray-500">Please select a category first</p>
              )}
            </div>
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
                placeholder="Enter YouTube video URL"
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
                Video File {isEditMode && '(Optional)'}
              </label>
              <FileInput
                onChange={handleVideoChange}
                className={errors.video ? 'border-red-500' : ''}
                accept="video/*"
              />
              {errors.video && (
                <p className="mt-1.5 text-xs text-red-500">{errors.video}</p>
              )}
            </div>
          )}

          {/* Thumbnail File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Video Thumbnail {isEditMode && '(Optional)'}
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
          {(thumbnailPreview || (isEditMode && editVideo?.thumbnailPath) || formData.thumbnail) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {formData.thumbnail ? 'New Thumbnail Preview' : (isEditMode && !formData.thumbnail ? 'Current Thumbnail' : 'Thumbnail Preview')}
              </label>
              <div className="w-24 h-24 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                {(() => {
                  // If there's a new thumbnail preview (from file selection), show it
                  if (thumbnailPreview && formData.thumbnail) {
                    return (
                      <img
                        src={thumbnailPreview}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={() => {
                          console.error('New thumbnail failed to load:', thumbnailPreview);
                        }}
                      />
                    );
                  }

                  // For edit mode, show existing thumbnail or "No Image Available"
                  if (isEditMode && editVideo?.thumbnailPath) {
                    if (existingThumbnailError) {
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
                          src={getImageUrl(editVideo.thumbnailPath)}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={() => {
                            console.error('Existing thumbnail failed to load, showing no image message');
                            setExistingThumbnailError(true);
                          }}
                        />
                      );
                    }
                  }

                  // If formData.thumbnail exists but no preview yet
                  if (formData.thumbnail) {
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
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Video' : 'Create Video')}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddVideoModal;