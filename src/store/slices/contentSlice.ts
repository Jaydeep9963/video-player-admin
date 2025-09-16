import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Content } from '../types';

interface ContentState {
  aboutUs: Content | null;
  privacyPolicy: Content | null;
  termsAndConditions: Content | null;
  loading: {
    aboutUs: boolean;
    privacyPolicy: boolean;
    termsAndConditions: boolean;
  };
  error: {
    aboutUs: string | null;
    privacyPolicy: string | null;
    termsAndConditions: string | null;
  };
}

const initialState: ContentState = {
  aboutUs: null,
  privacyPolicy: null,
  termsAndConditions: null,
  loading: {
    aboutUs: false,
    privacyPolicy: false,
    termsAndConditions: false,
  },
  error: {
    aboutUs: null,
    privacyPolicy: null,
    termsAndConditions: null,
  },
};

type ContentType = 'about-us' | 'privacy-policy' | 'terms-and-conditions';

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ type: ContentType; loading: boolean }>) => {
      const { type, loading } = action.payload;
      const key = type === 'about-us' ? 'aboutUs' : 
                  type === 'privacy-policy' ? 'privacyPolicy' : 'termsAndConditions';
      state.loading[key] = loading;
    },
    setContent: (state, action: PayloadAction<{ type: ContentType; content: Content | null }>) => {
      const { type, content } = action.payload;
      const key = type === 'about-us' ? 'aboutUs' : 
                  type === 'privacy-policy' ? 'privacyPolicy' : 'termsAndConditions';
      state[key] = content;
      state.loading[key] = false;
      state.error[key] = null;
    },
    setError: (state, action: PayloadAction<{ type: ContentType; error: string }>) => {
      const { type, error } = action.payload;
      const key = type === 'about-us' ? 'aboutUs' : 
                  type === 'privacy-policy' ? 'privacyPolicy' : 'termsAndConditions';
      state.error[key] = error;
      state.loading[key] = false;
    },
    clearError: (state, action: PayloadAction<ContentType>) => {
      const type = action.payload;
      const key = type === 'about-us' ? 'aboutUs' : 
                  type === 'privacy-policy' ? 'privacyPolicy' : 'termsAndConditions';
      state.error[key] = null;
    },
  },
});

export const { setLoading, setContent, setError, clearError } = contentSlice.actions;
export default contentSlice.reducer;
