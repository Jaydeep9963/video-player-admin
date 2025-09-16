import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { isTokenExpired } from '../../utils/tokenUtils';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check token validity on mount and periodically
    const checkTokenValidity = () => {
      if (token && isAuthenticated && isTokenExpired(token)) {
        console.log('Token expired, logging out...');
        dispatch(logout());
      }
    };

    // Check immediately
    checkTokenValidity();

    // Check every minute
    const interval = setInterval(checkTokenValidity, 60000);

    return () => clearInterval(interval);
  }, [token, isAuthenticated, dispatch]);

  return <>{children}</>;
};
