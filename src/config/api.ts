// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  BASE_IMAGE_URL: import.meta.env.VITE_IMAGE_BASE_URL,
  BASE_VIDEO_URL: import.meta.env.VITE_VIDEO_BASE_URL,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      PROFILE: '/auth/profile',
    },
    CATEGORIES: {
      GET_ALL: '/admin/categories',
      GET_BY_ID: '/admin/categories/:id',
      CREATE: '/admin/categories',
      UPDATE: '/admin/categories/:id',
      DELETE: '/admin/categories/:id',
    },
    SUBCATEGORIES: {
      GET_ALL: '/admin/subcategories',
      GET_BY_ID: '/admin/subcategories/:id',
      CREATE: '/admin/subcategories',
      UPDATE: '/admin/subcategories/:id',
      DELETE: '/admin/subcategories/:id',
    },
    VIDEOS: {
      GET_ALL: '/admin/videos',
      GET_BY_ID: '/admin/videos/:id',
      CREATE: '/admin/videos',
      UPDATE: '/admin/videos/:id',
      DELETE: '/admin/videos/:id',
    },
    SHORTS: {
      GET_ALL: '/admin/shorts',
      GET_BY_ID: '/admin/shorts/:id',
      CREATE: '/admin/shorts',
      UPDATE: '/admin/shorts/:id',
      DELETE: '/admin/shorts/:id',
    },
    FEEDBACK: {
      GET_ALL: '/feedback',
      GET_BY_ID: '/feedback/:id',
      CREATE: '/feedback',
      UPDATE: '/feedback/:id',
      DELETE: '/feedback/:id',
    },
    OVERVIEW: {
      GET: '/overview',
    },
    CONTENT: {
      GET_ALL: '/content',
      GET_BY_TYPE: '/content',
      CREATE: '/content',
      UPDATE: '/content/:id',
      DELETE: '/content/:id',
    },
  },
};

// Helper function to construct full image URLs
export const getImageUrl = (imagePath: string, bustCache: boolean = false): string => {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    const url = bustCache ? `${imagePath}?t=${Date.now()}` : imagePath;
    return url;
  }
  
  // If it's a relative path, construct the full URL
  const baseUrl = API_CONFIG.BASE_IMAGE_URL || 'http://192.168.1.129:3000';
  
  let fullUrl = '';
  // Handle different path formats
  if (imagePath.startsWith('/uploads/')) {
    fullUrl = `${baseUrl}${imagePath}`;
  } else if (imagePath.startsWith('uploads/')) {
    fullUrl = `${baseUrl}/${imagePath}`;
  } else {
    // Assume it's just the filename and construct the full path
    fullUrl = `${baseUrl}/uploads/images/${imagePath}`;
  }
  
  // Add cache-busting parameter if requested
  if (bustCache) {
    fullUrl += `?t=${Date.now()}`;
  }
  
  return fullUrl;
};

// Helper function to get image URL with cache busting for fresh images
export const getFreshImageUrl = (imagePath: string): string => {
  return getImageUrl(imagePath, true);
};

// You can update the BASE_URL above with your actual API endpoint
// For development, you might want to use: 'http://localhost:3000/api'
// For production, use your production API URL
