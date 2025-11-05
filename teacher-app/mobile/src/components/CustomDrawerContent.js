import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Share
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom drawer component that displays the user profile at the top,
 * renders the list of drawer items, and adds additional actions such
 * as rating the app, sharing, referring, chatting, and logging out.
 */
const CustomDrawerContent = (props) => {
  const { user, logout } = useContext(AuthContext);

  // Helper to open external links
  const openLink = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (err) {
      console.warn('Failed to open URL:', err);
    }
  };

  // Helper to share app link
  const onShare = async () => {
    try {
      await Share.share({
        message: 'Check out this amazing learning app!',
      });
    } catch (error) {
      console.warn('Error sharing:', error);
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, paddingTop: 0 }}
    >
      {/* Header with user info */}
      <View style={styles.headerContainer}>
        <View style={styles.profileWrapper}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.profileImage}
          />
          <Text style={styles.username}>
            {user?.name || 'Guest'}
          </Text>
        </View>
      </View>

      {/* List of default drawer items */}
      <DrawerItemList {...props} />

      {/* Additional drawer actions */}
      <DrawerItem
        label="Rate"
        icon={({ color, size }) => (
          <Ionicons name="star-outline" size={size} color={color} />
        )}
        onPress={() => openLink('https://play.google.com/store/apps/details?id=com.example.teacherapp')}
      />
      <DrawerItem
        label="Refer & Earn"
        icon={({ color, size }) => (
          <MaterialIcons name="card-giftcard" size={size} color={color} />
        )}
        onPress={() => onShare()}
      />
      <DrawerItem
        label="Share"
        icon={({ color, size }) => (
          <Ionicons name="share-outline" size={size} color={color} />
        )}
        onPress={() => onShare()}
      />
      <DrawerItem
        label="Chat"
        icon={({ color, size }) => (
          <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
        )}
        onPress={() => openLink('https://wa.me/919999999999')}
      />
      <DrawerItem
        label="Logout"
        icon={({ color, size }) => (
          <MaterialIcons name="logout" size={size} color={color} />
        )}
        onPress={() => logout()}
      />

      {/* Social links section at the bottom */}
      <View style={styles.socialContainer}>
        <Text style={styles.followText}>Follow us</Text>
        <View style={styles.socialRow}>
          <TouchableOpacity onPress={() => openLink('https://wa.me/919999999999')} style={styles.socialIconWrapper}>
            <FontAwesome name="whatsapp" size={24} color="#25D366" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink('https://t.me/yourchannel')} style={styles.socialIconWrapper}>
            <FontAwesome name="telegram" size={24} color="#0088CC" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink('https://www.instagram.com/yourprofile')} style={styles.socialIconWrapper}>
            <FontAwesome name="instagram" size={24} color="#C13584" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink('https://twitter.com/yourprofile')} style={styles.socialIconWrapper}>
            <FontAwesome name="twitter" size={24} color="#1DA1F2" />
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#f4f4f4',
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
  },
  profileWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
  },
  socialContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#e5e5e5',
    paddingTop: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  followText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  socialIconWrapper: {
    padding: 8,
  },
});

export default CustomDrawerContent;