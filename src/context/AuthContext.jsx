import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, getProfile } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('joblytic_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await getProfile();
      setUser(data);
    } catch {
      localStorage.removeItem('joblytic_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await loginUser({ email, password });
    localStorage.setItem('joblytic_token', data.token);
    const profile = await getProfile();
    setUser(profile.data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await registerUser({ name, email, password });
    localStorage.setItem('joblytic_token', data.token);
    const profile = await getProfile();
    setUser(profile.data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('joblytic_token');
    setUser(null);
  };

  const refreshUser = async () => {
    const { data } = await getProfile();
    setUser(data);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
