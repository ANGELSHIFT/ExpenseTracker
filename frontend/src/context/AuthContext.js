import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext(null);

// Django API base URL
const BASE_URL = 'http://127.0.0.1:8000';

// AuthProvider wraps the whole app and makes auth data available everywhere
export function AuthProvider({ children }) {
  // Load tokens from localStorage (so login persists on page refresh)
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem('accessToken') || null
  );
  const [refreshToken, setRefreshToken] = useState(
    () => localStorage.getItem('refreshToken') || null
  );

  // Simple flag: user is logged in if we have an access token
  const isAuthenticated = !!accessToken;

  // Save accessToken to localStorage whenever it changes
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, [accessToken]);

  // Save refreshToken to localStorage whenever it changes
  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }, [refreshToken]);

  // login() — calls Django JWT endpoint and stores tokens
  async function login(username, password) {
    try {
      const response = await axios.post(`${BASE_URL}/api/token/`, {
        username,
        password,
      });
      setAccessToken(response.data.access);
      setRefreshToken(response.data.refresh);
      return { success: true };
    } catch (err) {
      // Return error message from Django if available
      const msg =
        err.response?.data?.detail ||
        'Invalid username or password.';
      return { success: false, error: msg };
    }
  }

  // logout() — clears all tokens
  function logout() {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Expose everything components need
  const value = {
    accessToken,
    refreshToken,
    isAuthenticated,
    login,
    logout,
    setAccessToken, // needed by the Axios interceptor to update the token
    BASE_URL,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth hook — import this in any component that needs auth data
export function useAuth() {
  return useContext(AuthContext);
}
