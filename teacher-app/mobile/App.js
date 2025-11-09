import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, AuthContext } from './src/context/AuthContext';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import MyCoursesScreen from './src/screens/MyCoursesScreen';
import LiveClassesScreen from './src/screens/LiveClassesScreen';
import DownloadsScreen from './src/screens/DownloadsScreen';
import WhatsAppScreen from './src/screens/WhatsAppScreen';
import PurchaseScreen from './src/screens/PurchaseScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import RateScreen from './src/screens/RateScreen';
import ReferEarnScreen from './src/screens/ReferEarnScreen';
import ShareScreen from './src/screens/ShareScreen';
import ChatScreen from './src/screens/ChatScreen';
import CustomDrawerContent from './src/components/CustomDrawerContent';

// Create navigators
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

/**
 * Bottom tab navigator for the main sections of the app. It includes
 * Home, My Courses, Live Classes, Downloads and WhatsApp. Icons are
 * provided via Ionicons.
 */
const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'MyCourses':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'Live':
              iconName = focused ? 'play-circle' : 'play-circle-outline';
              break;
            case 'Downloads':
              iconName = focused ? 'download' : 'download-outline';
              break;
            case 'WhatsApp':
              iconName = focused ? 'logo-whatsapp' : 'logo-whatsapp';
              break;
            default:
              iconName = 'ellipse';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4e73df',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="MyCourses" component={MyCoursesScreen} options={{ title: 'My Courses' }} />
      <Tab.Screen name="Live" component={LiveClassesScreen} options={{ title: 'Live Class' }} />
      <Tab.Screen name="Downloads" component={DownloadsScreen} />
      <Tab.Screen name="WhatsApp" component={WhatsAppScreen} />
    </Tab.Navigator>
  );
};

/**
 * Drawer navigator that wraps the bottom tabs and exposes additional
 * sections such as purchases, settings, rate, refer & earn, share,
 * chat and logout. The custom drawer content component displays user
 * information and social links.
 */
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="HomeTabs" component={HomeTabs} options={{ title: 'Home' }} />
      <Drawer.Screen name="Purchase" component={PurchaseScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Rate" component={RateScreen} />
      <Drawer.Screen name="ReferEarn" component={ReferEarnScreen} options={{ title: 'Refer & Earn' }} />
      <Drawer.Screen name="Share" component={ShareScreen} />
      <Drawer.Screen name="Chat" component={ChatScreen} />
      {/* Logout is handled inside CustomDrawerContent */}
    </Drawer.Navigator>
  );
};

/**
 * Root navigator decides whether to show the authentication stack or the
 * main application based on the authentication state. The AuthContext
 * provides the user and loading flags.
 */
const RootNavigator = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return null; // Could render a splash screen here
  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={DrawerNavigator} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
      {/* Category screen is part of the main stack but sits outside the drawer */}
      <Stack.Screen name="Category" component={CategoryScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
