import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

/**
 * SettingsScreen displays basic information about the current user. In a full
 * featured application this screen could allow users to update their profile
 * information, change their password, and configure app preferences.
 */
const SettingsScreen = () => {
  const { user } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Settings</Text>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user?.name || '-'}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email || 'Not provided'}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{user?.phone || 'Not provided'}</Text>
      </View>
      <Text style={{ marginTop: 20, fontSize: 14, color: '#6b7280' }}>
        In a full version of this app you would be able to edit your details here.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    width: 80,
  },
  value: {
    flex: 1,
  },
});

export default SettingsScreen;