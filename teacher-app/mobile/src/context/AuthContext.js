import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Base URL for the backend API. When running the mobile app on a device or emulator
// you may need to update this to the appropriate IP address. For example,
// use "http://10.0.2.2:5000" on Android emulators or the IP of your development
// machine on a physical device.
const BASE_URL = 'http://localhost:5000';

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