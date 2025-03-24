import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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

  const login = async (email, password, role) => {
    try {
      setError(null);
      const response = await axios.post(`http://localhost:3001/auth/${role}/login`, {
        email,
        password,
      });
      
      const { access_token, user: userData } = response.data;
      
      if (!access_token || access_token === 'undefined') {
        throw new Error('Geçersiz access_token');
      }
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      console.error('Login Error:', error);
      setError(error.response?.data?.message || error.message || 'Giriş işlemi başarısız oldu');
      throw error;
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