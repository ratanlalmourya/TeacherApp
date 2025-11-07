import React, { createContext, useState, useEffect } from 'react';
import { NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import axios from 'axios';

const isExpoHostedDomain = (host) =>
  typeof host === 'string' && /\.?(expo\.(dev|io)|exp\.host)$/i.test(host);

const sanitiseHost = (hostUri) => {
  if (typeof URL === 'undefined') {
    return null;
  }
  try {
    const normalised = hostUri.includes('://') ? hostUri : `http://${hostUri}`;
    const { hostname } = new URL(normalised);
    if (!hostname || hostname === '127.0.0.1' || hostname === 'localhost') {
      return null;
    }
    if (isExpoHostedDomain(hostname)) {
      return null;
    }
    return hostname;
  } catch (error) {
    if (__DEV__) {
      console.warn('Failed to parse Expo host URI for API base URL:', hostUri, error);
    }
    return null;
  }
};

const isCodespacesHost = (hostname) =>
  typeof hostname === 'string' &&
  (hostname.includes('.app.github.dev') ||
    hostname.includes('.preview.app.github.dev') ||
    hostname.includes('.app.githubpreview.dev') ||
    hostname.includes('.app.githubusercontent.com'));

const normaliseCodespacesHostname = (hostname) => {
  if (!hostname) {
    return hostname;
  }

  const match = hostname.match(
    /^(.*?)-(\d+)\.(preview\.app\.github\.dev|app\.github\.dev|githubpreview\.dev|app\.githubusercontent\.com)$/i
  );

  if (!match) {
    return hostname;
  }

  const [, prefix, forwardedPort, domain] = match;
  const domainLower = domain.toLowerCase();
  const cleanedDomain = domainLower.includes('githubpreview.dev')
    ? 'app.github.dev'
    : domainLower.includes('githubusercontent.com')
    ? 'app.githubusercontent.com'
    : domainLower.replace('preview.', '');

  const targetHost = `${prefix}-5000.${cleanedDomain}`;
  return forwardedPort === '5000' && cleanedDomain === domainLower
    ? hostname
    : targetHost;
};

const buildBaseUrl = (hostname, protocolHint = 'http:') => {
  if (!hostname) {
    return null;
  }

  if (isCodespacesHost(hostname)) {
    // GitHub Codespaces forwards ports via subdomains and always requires HTTPS.
    const rewritten = normaliseCodespacesHostname(hostname);
    if (__DEV__ && rewritten !== hostname) {
      console.log('Resolved GitHub Codespaces API host:', rewritten);
    }
    return `https://${rewritten}`;
  }

  const protocol = protocolHint === 'https:' ? 'https' : 'http';
  const formattedHost =
    hostname && hostname.includes(':') && !hostname.startsWith('[')
      ? `[${hostname}]`
      : hostname;
  return `${protocol}://${formattedHost}:5000`;
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

  // During local development we can often derive the Metro bundler host from React Native
  const scriptUrl = NativeModules?.SourceCode?.scriptURL;
  if (scriptUrl) {
    try {
      const { hostname, protocol } = new URL(scriptUrl);
      if (hostname && !isExpoHostedDomain(hostname)) {
        const baseFromScript = buildBaseUrl(hostname, protocol);
        if (baseFromScript) {
          return baseFromScript;
        }
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('Failed to parse Metro script URL for API base URL:', scriptUrl, error);
      }
    }
  }

  // During local development with Expo Go we can usually derive the LAN IP from the debugger host
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.manifest?.hostUri ??
    Constants.manifest?.debuggerHost ??
    Constants.expoConfig?.debuggerHost;
  if (hostUri) {
    const host = sanitiseHost(hostUri);
    if (host) {
      return buildBaseUrl(host);
    }
  }

  // Fallbacks for emulators and tunnels where localhost should be translated appropriately
  if (Platform.OS === 'android') {
    // Android emulators map 10.0.2.2 back to the host machine
    return 'http://10.0.2.2:5000';
  }

  // Final fallback to localhost so automated tests or web previews continue to work
  return 'http://localhost:5000';
};

const BASE_URL = resolveBaseUrl();

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (__DEV__) {
      console.log('AuthContext using API base URL:', BASE_URL);
    }
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
