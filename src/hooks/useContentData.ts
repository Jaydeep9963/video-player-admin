import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setLoading, setContent, setError, clearError } from '../store/slices/contentSlice';
import { useGetContentByTypeQuery } from '../store/slices/api';
import { decodeHtmlEntities } from '../utils/htmlUtils';

type ContentType = 'about-us' | 'privacy-policy' | 'terms-and-conditions';

export const useContentData = (contentType: ContentType) => {
  const dispatch = useDispatch();
  
  // Get content from Redux store
  const key = contentType === 'about-us' ? 'aboutUs' : 
              contentType === 'privacy-policy' ? 'privacyPolicy' : 'termsAndConditions';
  
  const contentData = useSelector((state: RootState) => state.content[key]);
  const isLoading = useSelector((state: RootState) => state.content.loading[key]);
  const error = useSelector((state: RootState) => state.content.error[key]);
  
  // Force refetch every time by using refetchOnMountOrArgChange
  const { data: apiData, isLoading: apiLoading, error: apiError, refetch: originalRefetch } = useGetContentByTypeQuery(contentType, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  
  // Create custom refetch function that clears error before retrying
  const refetch = () => {
    dispatch(clearError(contentType));
    return originalRefetch();
  };
  
  // Force refetch on component mount
  useEffect(() => {
    console.log(`useContentData - Forcing refetch for ${contentType}`);
    originalRefetch();
  }, [originalRefetch, contentType]);
  
  useEffect(() => {
    console.log(`useContentData - Effect triggered for ${contentType}:`, { 
      apiData, 
      apiLoading, 
      apiError,
      hasData: !!apiData,
      dataType: typeof apiData,
      isArray: Array.isArray(apiData)
    });
    
    // Set loading state
    dispatch(setLoading({ type: contentType, loading: apiLoading }));
    
    if (apiError) {
      console.log(`useContentData - Error for ${contentType}:`, apiError);
      dispatch(setError({ type: contentType, error: 'Failed to load content' }));
    } else if (apiData && apiData.content) {
      console.log(`useContentData - Raw API data for ${contentType}:`, apiData);
      console.log(`useContentData - Raw content before decoding:`, apiData.content);
      
      // Decode HTML entities and store in Redux
      const decodedContent = decodeHtmlEntities(apiData.content);
      console.log(`useContentData - Decoded content for ${contentType}:`, decodedContent);
      
      const processedContent = {
        ...apiData,
        content: decodedContent
      };
      
      console.log(`useContentData - Dispatching processed content for ${contentType}:`, processedContent);
      dispatch(setContent({ type: contentType, content: processedContent }));
    } else if (!apiLoading) {
      console.log(`useContentData - No content found for ${contentType}, apiData:`, apiData);
      // No content found
      dispatch(setContent({ type: contentType, content: null }));
    }
  }, [apiData, apiLoading, apiError, contentType, dispatch]);
  
  // Log Redux state changes
  useEffect(() => {
    console.log(`useContentData - Redux state for ${contentType}:`, { contentData, isLoading, error });
  }, [contentData, isLoading, error, contentType]);
  
  return {
    contentData,
    isLoading,
    error,
    refetch
  };
};
