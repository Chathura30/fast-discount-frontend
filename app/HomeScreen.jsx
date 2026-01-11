import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import axios from 'axios';
import io from 'socket.io-client';
import BottomTab from '../components/BottomTab';
import { useNavigation } from '@react-navigation/native';
import { useFavorites } from '../context/FavoriteContext';
import { useCart } from '../context/CartContext';

const BASE_URL = 'http://172.20.10.7:5000';

const TodayProductCard = React.memo(
  ({ item, countdown, navigation, isFavorite, addToFavorites, removeFromFavorites, addToCart }) => {
    const now = new Date();
    const diffHours = (new Date(item.expire_date) - now) / (1000 * 60 * 60);

    const isAlmostExpired = diffHours <= 6;
    const isExpiringSoon = diffHours > 6 && diffHours <= 24;

    const imageUri = item.image
      ? { uri: item.image.startsWith('http') ? item.image : `${BASE_URL}${item.image}` }
      : { uri: 'https://via.placeholder.com/150' };

    return (
      <View style={styles.todayProductCard}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProductDetailScreen', { product: JSON.stringify(item) })}
        >
          <Image source={imageUri} style={styles.todayProductImage} />
        </TouchableOpacity>

        <Text style={styles.productTitle} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.oldPrice}>LKR {item.price}</Text>
        <Text style={styles.newPrice}>LKR {item.discount_price}</Text>

        {isAlmostExpired && <Text style={styles.urgentText}>🔥 Hurry! Almost expired</Text>}
        {isExpiringSoon && <Text style={styles.soonText}>⏳ Expiring Soon</Text>}

        <Text style={styles.countdownText}>
          {countdown?.days || 0}d {countdown?.hours || 0}h {countdown?.minutes || 0}m{' '}
          {countdown?.seconds || 0}s
        </Text>

        <View style={styles.iconRow}>
          <TouchableOpacity
            onPress={() =>
              isFavorite(item.id) ? removeFromFavorites(item.id) : addToFavorites(item)
            }
          >
            <Ionicons
              name={isFavorite(item.id) ? 'heart' : 'heart-outline'}
              size={24}
              color="red"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => addToCart(item)}>
            <Ionicons name="cart-outline" size={24} color="green" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

const ProductCard = React.memo(
  ({ item, countdown, navigation, isFavorite, addToFavorites, removeFromFavorites, addToCart }) => {
    const now = new Date();
    const diffHours = (new Date(item.expire_date) - now) / (1000 * 60 * 60);

    const isAlmostExpired = diffHours <= 6;
    const isExpiringSoon = diffHours > 6 && diffHours <= 24;

    const imageUri = item.image
      ? { uri: item.image.startsWith('http') ? item.image : `${BASE_URL}${item.image}` }
      : { uri: 'https://via.placeholder.com/150' };

    return (
      <View style={styles.productCard}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProductDetailScreen', { product: JSON.stringify(item) })}
        >
          <Image source={imageUri} style={styles.productImage} />
        </TouchableOpacity>

        <Text style={styles.productTitle} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.oldPrice}>LKR {item.price}</Text>
        <Text style={styles.newPrice}>LKR {item.discount_price}</Text>

        {isAlmostExpired && <Text style={styles.urgentText}>🔥 Hurry! Almost expired</Text>}
        {isExpiringSoon && <Text style={styles.soonText}>⏳ Expiring Soon</Text>}

        <Text style={styles.countdownText}>
          {countdown?.days || 0}d {countdown?.hours || 0}h {countdown?.minutes || 0}m{' '}
          {countdown?.seconds || 0}s
        </Text>

        <View style={styles.iconRow}>
          <TouchableOpacity
            onPress={() =>
              isFavorite(item.id) ? removeFromFavorites(item.id) : addToFavorites(item)
            }
          >
            <Ionicons
              name={isFavorite(item.id) ? 'heart' : 'heart-outline'}
              size={22}
              color="red"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => addToCart(item)}>
            <Ionicons name="cart-outline" size={22} color="green" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Loading...');
  const [products, setProducts] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const navigation = useNavigation();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { addToCart } = useCart();

  const PRODUCTS_PER_PAGE = 10;

  // Helper to remove duplicates
  const removeDuplicates = (arr) => {
    const seen = new Set();
    return arr.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  };

  // Socket for real-time updates
  useEffect(() => {
    const socket = io(BASE_URL);
    socket.on('newProduct', (product) =>
      setProducts((prev) => removeDuplicates([product, ...prev]))
    );
    socket.on('productExpired', ({ code }) =>
      setProducts((prev) => removeDuplicates(prev.filter((p) => p.code !== code)))
    );
    return () => socket.disconnect();
  }, []);

  // Initial fetch
  useEffect(() => {
    getUserLocation();
    fetchProducts(1);
  }, []);

  // Countdown interval
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updated = {};
      const validProducts = [];

      products.forEach((item) => {
        const diff = new Date(item.expire_date) - now;
        if (diff > 0) {
          updated[item.id] = {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
          };
          validProducts.push(item);
        }
      });

      setCountdowns(updated);
      if (validProducts.length !== products.length) {
        setProducts(removeDuplicates(validProducts));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [products]);

  // Fetch products
  const fetchProducts = async (pageNumber) => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/products/all?page=${pageNumber}&limit=${PRODUCTS_PER_PAGE}`);
      const newProducts = res.data;
      if (newProducts.length < PRODUCTS_PER_PAGE) setHasMore(false);
      setProducts((prev) =>
        removeDuplicates(pageNumber === 1 ? newProducts : [...prev, ...newProducts])
      );
      setPage(pageNumber);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get user location
  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocation('Location');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setLocation(`Lat: ${loc.coords.latitude.toFixed(2)}, Lon: ${loc.coords.longitude.toFixed(2)}`);
  };

  const handleSearch = useCallback((query) => setSearchQuery(query), []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayOnlyProducts = filteredProducts.filter((item) => {
    const diffHours = (new Date(item.expire_date) - new Date()) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 24;
  });

  const upcomingProducts = filteredProducts.filter((item) => {
    const diffHours = (new Date(item.expire_date) - new Date()) / (1000 * 60 * 60);
    return diffHours > 24;
  });

  const renderTodayProduct = useCallback(
    ({ item }) => (
      <TodayProductCard
        item={item}
        countdown={countdowns[item.id]}
        navigation={navigation}
        isFavorite={isFavorite}
        addToFavorites={addToFavorites}
        removeFromFavorites={removeFromFavorites}
        addToCart={addToCart}
      />
    ),
    [countdowns, navigation, isFavorite, addToFavorites, removeFromFavorites, addToCart]
  );

  const renderProduct = useCallback(
    ({ item }) => (
      <ProductCard
        item={item}
        countdown={countdowns[item.id]}
        navigation={navigation}
        isFavorite={isFavorite}
        addToFavorites={addToFavorites}
        removeFromFavorites={removeFromFavorites}
        addToCart={addToCart}
      />
    ),
    [countdowns, navigation, isFavorite, addToFavorites, removeFromFavorites, addToCart]
  );

  const loadMore = () => {
    if (!loading && hasMore) fetchProducts(page + 1);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topSection}>
        <View>
          <Text style={styles.location}>Sri Jayawardhanapura </Text>
          <Text style={styles.city}>{location}</Text>
        </View>

        <TouchableOpacity style={styles.notification}>
          <Ionicons name="notifications-outline" size={26} color="#fff" />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Here"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        <Image source={require('../assets/images/adaptive-icon1.png')} style={styles.heroImage} />
      </View>

      {/* Product Lists */}
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.todayBox}>
              <Text style={styles.todayTitle}>Today Only</Text>
              <FlatList
                data={todayOnlyProducts}
                keyExtractor={(item, index) => `today-${item.id}-${index}`}
                renderItem={renderTodayProduct}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.todayListContainer}
              />
            </View>

            <Text style={styles.sectionTitle}>All Category</Text>
          </>
        }
        data={upcomingProducts}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 100 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <ActivityIndicator size="large" color="#144D3C" />}
      />

      <BottomTab />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDEDED' },
  topSection: {
    backgroundColor: '#144D3C',
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
  },
  location: { color: '#fff', fontSize: 16 },
  city: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  notification: { position: 'absolute', right: 20, top: 25 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 16 },
  heroImage: { width: 180, height: 180, position: 'absolute', right: 20, top: 20 },
  todayBox: { 
    backgroundColor: '#f8f8f8', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 10,  
    marginVertical: 25,
    marginHorizontal: 10,
  },
  todayTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#000' },
  todayListContainer: {
    paddingRight: 15,
  },
  todayProductCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    width: 160,
    marginRight: 15,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  todayProductImage: { 
    width: '100%', 
    height: 120, 
    borderRadius: 10, 
    marginBottom: 8,
    resizeMode: 'cover',
  },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', marginVertical: 15, marginLeft: 15, color: '#000' },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    width: '48%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: { width: '100%', height: 100, borderRadius: 10, marginBottom: 8 },
  productTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4, color: '#000' },
  oldPrice: { textDecorationLine: 'line-through', color: '#999', fontSize: 13 },
  newPrice: { color: '#144D3C', fontWeight: 'bold', fontSize: 17, marginBottom: 4 },
  countdownText: { fontSize: 11, color: '#666', marginTop: 6, marginBottom: 8 },
  iconRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  urgentText: { color: 'red', fontWeight: 'bold', marginTop: 4, fontSize: 11 },
  soonText: { color: 'orange', fontWeight: '600', marginTop: 4, fontSize: 11 },
});


