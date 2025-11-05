import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';

/**
 * ShareScreen allows the user to share the app with friends. It uses the
 * Share API to bring up the native share sheet on the device. The
 * message could contain a link to the app store or website.
 */
const ShareScreen = () => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: 'I am learning with this great Teacher App! Join me: https://example.com/app',
      });
    } catch (error) {
      console.warn('Error sharing:', error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share the App</Text>
      <Text style={styles.description}>
        Let your friends know about this app! Tap the button below to open the
        share sheet.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleShare}>
        <Text style={styles.buttonText}>Share Now</Text>
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
    marginBottom: 20,
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

export default ShareScreen;