import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        logout();
        return;
      }

      const response = await fetch('http://localhost:8000/api/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);

        const decoded = jwtDecode(data.access);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser({ ...parsedUser, username: decoded.username });
        }

        setIsAuthenticated(true);
        return data.access;
      } else {
        logout();
      }
    } catch (error) {
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setUser(JSON.parse(storedUser));
        } else if (refreshToken) {
          await refreshAccessToken();
        } else {
          logout();
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, [refreshAccessToken, logout]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshAccessToken();
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshAccessToken]);

  const login = (username, role, access_token, refresh_token) => {
    setIsAuthenticated(true);
    setUser({ username, role });
    setLoading(false);

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user', JSON.stringify({ username, role }));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, refreshAccessToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
