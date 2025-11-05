import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

/**
 * HomeScreen displays a greeting to the user, a simple carousel placeholder
 * for promotional content, and a grid of course categories. Each category
 * navigates the user to a dedicated screen listing the available content.
 */
const HomeScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);

  const categories = [
    { key: 'special', title: 'Special courses' },
    { key: 'liveRecorded', title: 'Live + Recorded Courses' },
    { key: 'recorded', title: 'Recorded Courses' },
    { key: 'testSeries', title: 'Test Series' },
    { key: 'free', title: 'Free Courses' },
    { key: 'demo', title: 'Demo courses' },
    { key: 'pdfNotes', title: 'PDF / Notes Store' },
    { key: 'books', title: 'Book Store' },
  ];

  const openDrawer = () => {
    navigation.getParent()?.openDrawer();
  };

  const navigateCategory = (item) => {
    navigation.navigate('Category', {
      key: item.key,
      title: item.title,
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with menu and notifications */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.headerIcon}>
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>
        <Image
          source={require('../../assets/icon.png')}
          style={{ width: 40, height: 40, resizeMode: 'contain' }}
        />
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="notifications-outline" size={26} color="#000" />
        </TouchableOpacity>
      </View>
      <Text style={styles.greeting}>Hello{user?.name ? `, ${user.name}` : ''}</Text>
      {/* Carousel placeholder */}
      <View style={styles.carouselContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
        >
          <View style={[styles.carouselItem, { backgroundColor: '#fcd34d' }]}> 
            <Text style={styles.carouselText}>Join our upcoming live batch!</Text>
          </View>
          <View style={[styles.carouselItem, { backgroundColor: '#86efac' }]}> 
            <Text style={styles.carouselText}>Avail early bird discounts</Text>
          </View>
          <View style={[styles.carouselItem, { backgroundColor: '#93c5fd' }]}> 
            <Text style={styles.carouselText}>Download free study material</Text>
          </View>
        </ScrollView>
      </View>
      {/* Category grid */}
      <View style={styles.gridContainer}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={styles.card}
            onPress={() => navigateCategory(item)}
          >
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerIcon: {
    padding: 4,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '600',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  carouselContainer: {
    height: 160,
    marginBottom: 16,
  },
  carouselItem: {
    width: 300,
    height: 160,
    borderRadius: 12,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  carouselText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  card: {
    width: '47%',
    height: 90,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default HomeScreen;