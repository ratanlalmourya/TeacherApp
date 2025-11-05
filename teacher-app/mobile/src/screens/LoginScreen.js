import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

/**
 * LoginScreen allows users to authenticate using either a password or an OTP.
 * Users can enter their email or phone number along with a password or one‑time
 * password. The screen uses AuthContext to handle the login request and
 * manage authentication state.
 */
const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [useOtp, setUseOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    // Determine if identifier is email or phone
    const isEmail = identifier.includes('@');
    const payload = {
      email: isEmail ? identifier : undefined,
      phone: isEmail ? undefined : identifier,
      password: useOtp ? undefined : password,
      otp: useOtp ? otp : undefined,
    };
    const result = await login(payload);
    setLoading(false);
    if (!result.success) {
      setError(result.message || 'Failed to login');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
        <TextInput
          placeholder="Email or Phone"
          value={identifier}
          onChangeText={setIdentifier}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {useOtp ? (
          <TextInput
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            style={styles.input}
            keyboardType="number-pad"
          />
        ) : (
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
          />
        )}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity
          style={styles.toggle}
          onPress={() => setUseOtp((prev) => !prev)}
        >
          <Text style={styles.toggleText}>
            {useOtp ? 'Login with Password' : 'Login with OTP'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={{ marginTop: 20 }}
        >
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4e73df',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggle: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  toggleText: {
    color: '#4e73df',
    fontWeight: '600',
  },
  link: {
    color: '#4e73df',
    textAlign: 'center',
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default LoginScreen;