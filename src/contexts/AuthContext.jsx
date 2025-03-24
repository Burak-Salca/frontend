import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkLocalStorage = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');

    if (token && token !== 'undefined' && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(parsedUserData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Local storage parse error:', error);
        clearAuthData();
      }
    } else {
      clearAuthData();
    }
  };

  useEffect(() => {
    checkLocalStorage();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

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
    clearAuthData();
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