import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import axios from 'axios';

const sanitiseHost = (hostUri) => {
  if (typeof URL === 'undefined') {
    return null;
  }
  try {
    const normalised = hostUri.includes('://') ? hostUri : `http://${hostUri}`;
    const { hostname } = new URL(normalised);
    return hostname;
  } catch (error) {
    if (__DEV__) {
      console.warn('Failed to parse Expo host URI for API base URL:', hostUri, error);
    }
    return null;
  }
};

const resolveBaseUrl = () => {
  // Highest priority: explicit environment variable set via Expo (EXPO_PUBLIC_API_BASE_URL)
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (envUrl) {
    return envUrl;
  }

  // Next priority: value from app config (app.json/app.config.js -> expo.extra.apiBaseUrl)
  const expoConfig = Constants.expoConfig ?? Constants.manifest;
  const extraUrl = expoConfig?.extra?.apiBaseUrl;
  if (extraUrl) {
    return extraUrl;
  }

  // During local development with Expo Go we can usually derive the LAN IP from the debugger host
  if (__DEV__) {
    const hostUri = Constants.expoConfig?.hostUri ?? Constants.manifest?.debuggerHost;
    if (hostUri) {
      const host = sanitiseHost(hostUri);
      if (host && host !== '127.0.0.1' && host !== 'localhost') {
        return `http://${host}:5000`;
      }
    }
  }

  // Fallback to localhost so automated tests or web previews continue to work
  return 'http://localhost:5000';
};

const BASE_URL = resolveBaseUrl();

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved authentication state from storage on mount
    const loadAuthState = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log('Error loading auth state:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAuthState();
  }, []);

  // Login with either password or OTP
  const login = async ({ email, phone, password, otp }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/login`, {
        email,
        phone,
        password,
        otp,
      });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      await AsyncStorage.setItem('token', newToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      if (__DEV__) {
        console.warn('Login request failed:', error?.message, error?.response?.data);
      }
      const message =
        error?.response?.data?.message ||
        `Unable to reach the server at ${BASE_URL}. Please confirm it is running and accessible.`;
      return { success: false, message };
    }
  };

  // Register a new user
  const register = async ({ name, email, phone, password }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/register`, {
        name,
        email,
        phone,
        password,
      });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      await AsyncStorage.setItem('token', newToken);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      if (__DEV__) {
        console.warn('Registration request failed:', error?.message, error?.response?.data);
      }
      const message =
        error?.response?.data?.message ||
        `Unable to reach the server at ${BASE_URL}. Please confirm it is running and accessible.`;
      return { success: false, message };
    }
  };

  // Logout the current user
  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, BASE_URL }}
    >
      {children}
    </AuthContext.Provider>
  );
};