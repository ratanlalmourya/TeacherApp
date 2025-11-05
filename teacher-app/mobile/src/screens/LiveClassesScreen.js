import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

/**
 * LiveClassesScreen fetches upcoming live classes from the server and
 * displays them in a list. Each item shows the title, start time and
 * description. A "Join" button could be connected to a streaming
 * interface or external service. For demo purposes it simply logs to
 * the console.
 */
const LiveClassesScreen = () => {
  const { BASE_URL } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/live`);
        setClasses(res.data.items);
      } catch (err) {
        console.log(err);
        setError('Failed to load live classes');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemTime}>Starts: {new Date(item.startTime).toLocaleString()}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <TouchableOpacity
        style={styles.joinButton}
        onPress={() => console.log('Join class', item.id)}
      >
        <Text style={styles.joinButtonText}>Join</Text>
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
  if (!classes.length) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No live classes scheduled.</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={classes}
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
  itemTime: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  joinButton: {
    backgroundColor: '#4e73df',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default LiveClassesScreen;