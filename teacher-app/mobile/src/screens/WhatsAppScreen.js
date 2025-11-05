import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

/**
 * WhatsAppScreen presents a call‑to‑action encouraging users to message the
 * teacher via WhatsApp. It uses the Linking API to open a pre‑filled
 * WhatsApp chat with a specified phone number.
 */
const WhatsAppScreen = () => {
  const whatsappNumber = '919999999999'; // Replace with the teacher's phone number
  const message = encodeURIComponent('Hello, I would like to enquire about your courses.');
  const url = `https://wa.me/${whatsappNumber}?text=${message}`;

  const openWhatsApp = async () => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.warn('Unable to open WhatsApp:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FontAwesome name="whatsapp" size={64} color="#25D366" />
      <Text style={styles.title}>Chat with us on WhatsApp</Text>
      <Text style={styles.description}>
        Tap the button below to start a conversation and get your questions
        answered.
      </Text>
      <TouchableOpacity style={styles.button} onPress={openWhatsApp}>
        <Text style={styles.buttonText}>Open WhatsApp</Text>
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
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginVertical: 16,
  },
  button: {
    backgroundColor: '#25D366',
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

export default WhatsAppScreen;