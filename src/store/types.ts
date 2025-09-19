export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: {
    access: {
      token: string;
      expires: string;
    };
    refresh: {
      token: string;
      expires: string;
    };
  };
}

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Category types
export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  videoCount: number;
  subcategoryCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetCategoriesResponse {
  categories: Category[];
  total: number;
}

export interface GetCategoriesRequest {
  page?: number;
  limit?: number;
  search?: string;
}

// Subcategory types
export interface Subcategory {
  _id: string;
  name: string;
  description: string;
  category: Category | string;
  image: string;
  videoCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type SubcategoriesResponse = Subcategory[];

export interface GetSubcategoriesRequest {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

// Video types
export interface Video {
  _id: string;
  title: string;
  description: string;
  fileName: string;
  filePath: string;
  platform: string;
  youtubeUrl?: string;
  thumbnailPath: string;
  durationFormatted: string;
  category: Category;
  subcategory: Subcategory;
  views: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetVideosRequest {
  page?: number;
  limit?: number;
  search?: string;
}

// Shorts types
export interface Short {
  _id: string;
  title: string;
  description: string;
  fileName: string;
  filePath: string;
  platform: string;
  youtubeUrl?: string;
  thumbnailPath: string;
  durationFormatted: string;
  views: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetShortsRequest {
  page?: number;
  limit?: number;
  search?: string;
}

// Feedback/Reviews types
export interface Feedback {
  _id: string;
  name: string;
  mobile: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetFeedbackRequest {
  page?: number;
  limit?: number;
  search?: string;
}

// Overview types
export interface OverviewCounts {
  categories: number;
  subcategories: number;
  videos: number;
  shorts: number;
  feedback: number;
}

export interface OverviewResponse {
  counts: OverviewCounts;
  recentItems: any[];
}

export interface RecentItem {
  _id: string;
  title: string;
  description: string;
  durationFormatted: number;
  category?: {
    _id: string;
    name: string;
  };
  subcategory?: {
    _id: string;
    name: string;
  };
  platform: string;
  thumbnailPath: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

// Content types
export interface Content {
  _id: string;
  type: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateContentRequest {
  type: string;
  content: string;
}

export interface UpdateContentRequest {
  type: string;
  content: string;
}

export interface GetContentRequest {
  type?: string;
}

