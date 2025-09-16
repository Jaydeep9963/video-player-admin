import { configureStore } from '@reduxjs/toolkit';
import { authApi, categoriesApi, subcategoriesApi, videosApi, shortsApi, feedbackApi, overviewApi, contentApi } from './slices/api';
import authReducer from './slices/authSlice';
import contentReducer from './slices/contentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    content: contentReducer,
    [authApi.reducerPath]: authApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [subcategoriesApi.reducerPath]: subcategoriesApi.reducer,
    [videosApi.reducerPath]: videosApi.reducer,
    [shortsApi.reducerPath]: shortsApi.reducer,
    [feedbackApi.reducerPath]: feedbackApi.reducer,
    [overviewApi.reducerPath]: overviewApi.reducer,
    [contentApi.reducerPath]: contentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      categoriesApi.middleware,
      subcategoriesApi.middleware,
      videosApi.middleware,
      shortsApi.middleware,
      feedbackApi.middleware,
      overviewApi.middleware,
      contentApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
