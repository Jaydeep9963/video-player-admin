import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  LoginRequest, 
  LoginResponse, 
  GetCategoriesRequest, 
  Category,
  Subcategory,
  GetSubcategoriesRequest,
  Video,
  GetVideosRequest,
  Short,
  GetShortsRequest,
  Feedback,
  GetFeedbackRequest,
  OverviewResponse,
  Content,
  CreateContentRequest,
  UpdateContentRequest,
  GetContentRequest
} from '../types';
import { API_CONFIG } from '../../config/api';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    prepareHeaders: (headers: Headers, { getState }) => {
      // Get token from state if available
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: API_CONFIG.ENDPOINTS.AUTH.LOGOUT,
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    refreshToken: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    getProfile: builder.query<{ user: any }, void>({
      query: () => API_CONFIG.ENDPOINTS.AUTH.PROFILE,
      providesTags: ['Auth'],
    }),
  }),
});

// Categories API
export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    prepareHeaders: (headers: Headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      // Don't set content-type for FormData - let browser set it with boundary
      return headers;
    },
  }),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], GetCategoriesRequest | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.search) searchParams.append('search', params.search);
        
        const queryString = searchParams.toString();
        return `${API_CONFIG.ENDPOINTS.CATEGORIES.GET_ALL}${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation<Category, FormData>({
      query: (formData) => ({
        url: API_CONFIG.ENDPOINTS.CATEGORIES.CREATE,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: API_CONFIG.ENDPOINTS.CATEGORIES.DELETE.replace(':id', id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation<Category, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: API_CONFIG.ENDPOINTS.CATEGORIES.UPDATE.replace(':id', id),
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Category'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Force refetch of categories to get fresh image URLs
          dispatch(categoriesApi.util.invalidateTags(['Category']));
        } catch {}
      },
    }),
  }),
});

// Subcategories API
export const subcategoriesApi = createApi({
  reducerPath: 'subcategoriesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    prepareHeaders: (headers: Headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      // Don't set content-type for FormData - let browser set it with boundary
      return headers;
    },
  }),
  tagTypes: ['Subcategory'],
  endpoints: (builder) => ({
    getSubcategories: builder.query<Subcategory[], GetSubcategoriesRequest | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.search) searchParams.append('search', params.search);
        
        const queryString = searchParams.toString();
        return `${API_CONFIG.ENDPOINTS.SUBCATEGORIES.GET_ALL}${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Subcategory'],
    }),
    createSubcategory: builder.mutation<Subcategory, FormData>({
      query: (formData) => ({
        url: API_CONFIG.ENDPOINTS.SUBCATEGORIES.CREATE,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Subcategory'],
    }),
    deleteSubcategory: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: API_CONFIG.ENDPOINTS.SUBCATEGORIES.DELETE.replace(':id', id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Subcategory'],
    }),
    updateSubcategory: builder.mutation<Subcategory, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: API_CONFIG.ENDPOINTS.SUBCATEGORIES.UPDATE.replace(':id', id),
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Subcategory'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Force refetch of subcategories to get fresh image URLs
          dispatch(subcategoriesApi.util.invalidateTags(['Subcategory']));
        } catch {}
      },
    }),
  }),
});

// Videos API
export const videosApi = createApi({
  reducerPath: 'videosApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    prepareHeaders: (headers: Headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      // Don't set content-type for FormData - let browser set it with boundary
      return headers;
    },
  }),
  tagTypes: ['Video'],
  endpoints: (builder) => ({
    getVideos: builder.query<Video[], GetVideosRequest | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.search) searchParams.append('search', params.search);
        
        const queryString = searchParams.toString();
        return `${API_CONFIG.ENDPOINTS.VIDEOS.GET_ALL}${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Video'],
    }),
    createVideo: builder.mutation<Video, FormData>({
      query: (data) => ({
        url: API_CONFIG.ENDPOINTS.VIDEOS.CREATE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Video'],
    }),
    deleteVideo: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: API_CONFIG.ENDPOINTS.VIDEOS.DELETE.replace(':id', id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Video'],
    }),
    updateVideo: builder.mutation<Video, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: API_CONFIG.ENDPOINTS.VIDEOS.UPDATE.replace(':id', id),
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Video'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Force refetch of videos to get fresh image URLs
          dispatch(videosApi.util.invalidateTags(['Video']));
        } catch {}
      },
    }),
  }),
});

// Shorts API
export const shortsApi = createApi({
  reducerPath: 'shortsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    prepareHeaders: (headers: Headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Short'],
  endpoints: (builder) => ({
    getShorts: builder.query<Short[], GetShortsRequest | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.search) searchParams.append('search', params.search);
        
        const queryString = searchParams.toString();
        return `${API_CONFIG.ENDPOINTS.SHORTS.GET_ALL}${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Short'],
    }),
    createShort: builder.mutation<Short, FormData>({
      query: (data) => ({
        url: API_CONFIG.ENDPOINTS.SHORTS.CREATE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Short'],
    }),
    deleteShort: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: API_CONFIG.ENDPOINTS.SHORTS.DELETE.replace(':id', id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Short'],
    }),
    updateShort: builder.mutation<Short, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: API_CONFIG.ENDPOINTS.SHORTS.UPDATE.replace(':id', id),
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Short'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Force refetch of shorts to get fresh image URLs
          dispatch(shortsApi.util.invalidateTags(['Short']));
        } catch {}
      },
    }),
  }),
});

// Feedback API
export const feedbackApi = createApi({
  reducerPath: 'feedbackApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    prepareHeaders: (headers: Headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Feedback'],
  endpoints: (builder) => ({
    getFeedback: builder.query<Feedback[], GetFeedbackRequest | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit) searchParams.append('limit', params.limit.toString());
        if (params?.search) searchParams.append('search', params.search);
        
        const queryString = searchParams.toString();
        return `${API_CONFIG.ENDPOINTS.FEEDBACK.GET_ALL}${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Feedback'],
    }),
  }),
});

// Overview API
export const overviewApi = createApi({
  reducerPath: 'overviewApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    prepareHeaders: (headers: Headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Overview'],
  endpoints: (builder) => ({
    getOverview: builder.query<OverviewResponse, void>({
      query: () => API_CONFIG.ENDPOINTS.OVERVIEW.GET,
      providesTags: ['Overview'],
    }),
  }),
});

// Content API
export const contentApi = createApi({
  reducerPath: 'contentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    prepareHeaders: (headers: Headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Content'],
  endpoints: (builder) => ({
    getContent: builder.query<Content[], GetContentRequest>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.type) searchParams.append('type', params.type);
        
        const queryString = searchParams.toString();
        return `${API_CONFIG.ENDPOINTS.CONTENT.GET_BY_TYPE}${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Content'],
    }),
    getContentByType: builder.query<Content | null, string>({
      query: (type) => {
        const searchParams = new URLSearchParams();
        searchParams.append('type', type);
        return `${API_CONFIG.ENDPOINTS.CONTENT.GET_BY_TYPE}?${searchParams.toString()}`;
      },
      transformResponse: (response: Content | Content[] | null) => {
        // Handle both single object and array responses
        if (!response) return null;
        if (Array.isArray(response)) {
          return response.length > 0 ? response[0] : null;
        }
        // If it's a single object, return it directly
        return response;
      },
      providesTags: ['Content'],
    }),
    createContent: builder.mutation<Content, CreateContentRequest>({
      query: (body) => ({
        url: API_CONFIG.ENDPOINTS.CONTENT.CREATE,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Content'],
    }),
    updateContent: builder.mutation<Content, { id: string; data: UpdateContentRequest }>({
      query: ({ id, data }) => ({
        url: API_CONFIG.ENDPOINTS.CONTENT.UPDATE.replace(':id', id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Content'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetProfileQuery,
} = authApi;

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} = categoriesApi;

export const {
  useGetSubcategoriesQuery,
  useCreateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useUpdateSubcategoryMutation,
} = subcategoriesApi;

export const {
  useGetVideosQuery,
  useCreateVideoMutation,
  useDeleteVideoMutation,
  useUpdateVideoMutation,
} = videosApi;

export const {
  useGetShortsQuery,
  useCreateShortMutation,
  useDeleteShortMutation,
  useUpdateShortMutation,
} = shortsApi;

export const {
  useGetFeedbackQuery,
} = feedbackApi;

export const {
  useGetOverviewQuery,
} = overviewApi;

export const {
  useGetContentQuery,
  useGetContentByTypeQuery,
  useCreateContentMutation,
  useUpdateContentMutation,
} = contentApi;
