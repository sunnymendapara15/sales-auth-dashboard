import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { setAuthToken } from './services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('sales_auth_token') || '');

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('sales_auth_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('sales_auth_token');
    setToken('');
  };

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
