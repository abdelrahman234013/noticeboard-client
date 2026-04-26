import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import {
  getCurrentUser,
  loginUser as loginUserApi,
  logoutUser as logoutUserApi,
  registerUser as registerUserApi,
} from '../api/authApi';

const AuthContext = createContext(null);

const extractUser = (payload) => payload?.data?.user || payload?.user || null;

const getErrorMessage = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await getCurrentUser();
      const currentUser = extractUser(data);
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (formData) => {
    const response = await loginUserApi(formData);
    const currentUser = extractUser(response);
    setUser(currentUser);
    return currentUser;
  };

  const register = async (formData) => {
    const response = await registerUserApi(formData);
    const currentUser = extractUser(response);
    setUser(currentUser);
    return currentUser;
  };

  const logout = async () => {
    try {
      await logoutUserApi();
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to log out'));
    } finally {
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
      getErrorMessage,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
