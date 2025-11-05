import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';

/**
 * ReferEarnScreen allows users to invite friends to the app via a referral
 * code. In this demo the code is static, but in a real application it
 * would be generated for each user on the server. Sharing invokes the
 * native share sheet to disseminate the referral link.
 */
const ReferEarnScreen = () => {
  const referralCode = 'TEACH123';
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join this amazing learning platform! Use my referral code ${referralCode} to sign up: https://example.com/app`,
      });
    } catch (error) {
      console.warn('Error sharing:', error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Refer & Earn</Text>
      <Text style={styles.description}>
        Invite your friends to join the app using your referral code below.
      </Text>
      <View style={styles.codeContainer}>
        <Text style={styles.code}>{referralCode}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleShare}>
        <Text style={styles.buttonText}>Share Code</Text>
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
  codeContainer: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#4e73df',
    borderRadius: 8,
    marginBottom: 20,
  },
  code: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4e73df',
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

export default ReferEarnScreen;