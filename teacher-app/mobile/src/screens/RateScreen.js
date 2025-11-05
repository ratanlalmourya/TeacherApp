import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

/**
 * RateScreen encourages users to rate the app on the Play Store. This
 * implementation demonstrates how to open a web link. In a real app
 * you would provide a deep link directly to your Play Store listing.
 */
const RateScreen = () => {
  const openStore = async () => {
    try {
      await Linking.openURL(
        'https://play.google.com/store/apps/details?id=com.example.teacherapp'
      );
    } catch (err) {
      console.warn('Failed to open store', err);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enjoying the app?</Text>
      <Text style={styles.description}>
        Your feedback helps us improve. Tap the button below to rate us on the
        store.
      </Text>
      <TouchableOpacity style={styles.button} onPress={openStore}>
        <Text style={styles.buttonText}>Rate Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#4e73df',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RateScreen;