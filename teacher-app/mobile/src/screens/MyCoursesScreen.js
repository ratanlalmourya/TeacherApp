import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

/**
 * MyCoursesScreen displays courses that the current user has purchased. It
 * retrieves a list of purchased course IDs from AsyncStorage and then
 * fetches all available courses from the server, filtering them to only
 * show purchased ones.
 */
const MyCoursesScreen = () => {
  const { BASE_URL, token } = useContext(AuthContext);
  const [purchasedIds, setPurchasedIds] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPurchased = async () => {
      try {
        const stored = await AsyncStorage.getItem('purchased');
        const ids = stored ? JSON.parse(stored) : [];
        setPurchasedIds(ids);
        // Fetch all courses
        const res = await axios.get(`${BASE_URL}/api/courses`);
        const { courses: data } = res.data;
        // Flatten into single list
        const all = Object.values(data).flat();
        // Filter purchased courses
        const purchased = all.filter((c) => ids.includes(c.id));
        setCourses(purchased);
      } catch (err) {
        console.log(err);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchPurchased();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4e73df" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{error}</Text>
      </View>
    );
  }
  if (!courses.length) {
    return (
      <View style={styles.loadingContainer}>
        <Text>You haven't purchased any courses yet.</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={courses}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#374151',
  },
});

export default MyCoursesScreen;