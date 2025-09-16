import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { useLoginMutation, useLogoutMutation } from '../store/slices/api';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';
import { LoginRequest } from '../store/types';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();

  const login = async (credentials: LoginRequest) => {
    try {
      dispatch(loginStart());
      const result = await loginMutation(credentials).unwrap();
      
      // Handle the actual API response structure
      if (result.user && result.tokens) {
        dispatch(loginSuccess({
          user: result.user,
          token: result.tokens.access.token,
          refreshToken: result.tokens.refresh.token,
        }));
        return { success: true };
      } else {
        dispatch(loginFailure('Login failed - Invalid response'));
        return { success: false, error: 'Login failed - Invalid response' };
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      // Even if logout API fails, we still want to clear local state
      console.error('Logout API failed:', error);
    } finally {
      dispatch(logout());
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout: handleLogout,
  };
};
