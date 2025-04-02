import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Axios interceptor ekle
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined') {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      delete axios.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(user));
      setIsAuthenticated(true);
      setUser(user);
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Giriş başarısız');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(user));
      setIsAuthenticated(true);
      setUser(user);
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Kayıt başarısız');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    setUser,
    login,
    logout,
    error,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 