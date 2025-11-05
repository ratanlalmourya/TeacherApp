import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * ChatScreen provides a simple interface for users to initiate a chat
 * with the teacher. This demo opens a WhatsApp chat when the button
 * is pressed. In a full version of the app this could be replaced
 * with a real time chat implementation.
 */
const ChatScreen = () => {
  const phoneNumber = '919999999999';
  const url = `https://wa.me/${phoneNumber}`;

  const openChat = async () => {
    try {
      await Linking.openURL(url);
    } catch (err) {
      console.warn('Failed to open chat:', err);
    }
  };
  return (
    <View style={styles.container}>
      <Ionicons name="chatbubble-ellipses-outline" size={64} color="#4e73df" />
      <Text style={styles.title}>Chat with Teacher</Text>
      <Text style={styles.description}>
        Start a conversation to clear your doubts or get assistance.
      </Text>
      <TouchableOpacity style={styles.button} onPress={openChat}>
        <Text style={styles.buttonText}>Start Chat</Text>
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

export default ChatScreen;