import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

/**
 * PurchaseScreen lists all available courses grouped by category and allows
 * the user to purchase them. Purchased courses are stored locally in
 * AsyncStorage so they appear in the MyCourses screen. In a real app
 * purchasing would integrate a payment gateway and update the server.
 */
const PurchaseScreen = () => {
  const { BASE_URL } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/courses`);
        const all = Object.values(res.data.courses).flat();
        setCourses(all);
      } catch (err) {
        console.log(err);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePurchase = async (item) => {
    try {
      const stored = await AsyncStorage.getItem('purchased');
      let ids = stored ? JSON.parse(stored) : [];
      if (ids.includes(item.id)) {
        Alert.alert('Already Purchased', 'You have already purchased this course.');
        return;
      }
      ids.push(item.id);
      await AsyncStorage.setItem('purchased', JSON.stringify(ids));
      Alert.alert('Purchase Successful', `You have purchased ${item.title}`);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to purchase course');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
      </View>
      <TouchableOpacity
        style={styles.buyButton}
        onPress={() => handlePurchase(item)}
      >
        <Text style={styles.buyButtonText}>Buy</Text>
      </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4e73df',
  },
  buyButton: {
    backgroundColor: '#4e73df',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'center',
    marginLeft: 12,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default PurchaseScreen;