import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Create context
const AuthContext = createContext();

// Custom hook to use AuthContext easily
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if token exists when app loads
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      const decoded = jwtDecode(token);

      // If token is valid and hasn't expired, set authentication to true
      if (decoded.exp * 1000 > Date.now()) {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
      } else {
        setIsAuthenticated(false);
      }
    }
  }, []);

  // Login function (set authenticated true)
  const login = (username, role, access_token) => {
    setIsAuthenticated(true);
    setUser({ username, role });
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify({ username, role }));
  };

  // Logout function (remove token and set authenticated false)
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
