import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import axios from 'axios';
import { Platform } from 'react-native';

// Dynamically determine the backend URL so the app works in hosted environments
// (GitHub Codespaces, tunnels, etc.), emulators, and on-device testing. The order
// of precedence is:
//   1. Explicit EXPO_PUBLIC_API_URL environment variable
//   2. Expo host/manifest information (helpful for Codespaces)
//   3. Platform-specific localhost fallbacks
const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const hostUri =
    Constants?.expoConfig?.hostUri ||
    Constants?.manifest2?.extra?.expoClient?.hostUri ||
    Constants?.manifest?.debuggerHost;

  if (hostUri) {
    const hostname = hostUri.split(':')[0];
    if (hostname) {
      return `http://${hostname}:5000`;
    }
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  }

  return 'http://localhost:5000';
};

const BASE_URL = getBaseUrl();

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
      const message =
        error?.response?.data?.message || 'An error occurred while logging in.';
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
      const message =
        error?.response?.data?.message || 'An error occurred while registering.';
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
