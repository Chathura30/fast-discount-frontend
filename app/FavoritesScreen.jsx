import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoriteContext';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import BottomTab from '../components/BottomTab';

const BASE_URL = 'http://172.20.10.7:5000';

export default function FavoritesScreen() {
  const { favorites, removeFromFavorites, isFavorite, addToFavorites } = useFavorites();
  const { addToCart } = useCart();
  const navigation = useNavigation();
  const [countdowns, setCountdowns] = useState({});

  // ⏱ Countdown timer (same as Home)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updated = {};
      const validFavorites = [];

      favorites.forEach((item) => {
        const diff = new Date(item.expire_date) - now;
        if (diff > 0) {
          updated[item.id] = {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
          };
          validFavorites.push(item);
        }
      });

      setCountdowns(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [favorites]);

  const renderFavoriteItem = ({ item }) => {
    const now = new Date();
    const diffHours = (new Date(item.expire_date) - now) / (1000 * 60 * 60);

    const isAlmostExpired = diffHours <= 6;
    const isExpiringSoon = diffHours > 6 && diffHours <= 24;

    const imageUri = item.image
      ? { uri: item.image.startsWith('http') ? item.image : `${BASE_URL}${item.image}` }
      : { uri: 'https://via.placeholder.com/150' };

    return (
      <View style={styles.card}>
        {/* 🖼 Product Image */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProductDetailScreen', { product: JSON.stringify(item) })
          }
        >
          <Image source={imageUri} style={styles.image} />
        </TouchableOpacity>

        {/* 🏷 Product Info */}
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.oldPrice}>LKR {item.price}</Text>
        <Text style={styles.newPrice}>LKR {item.discount_price}</Text>

        {/* 🔥 Countdown or Expiry Alerts */}
        {isAlmostExpired && <Text style={styles.urgentText}>🔥 Hurry! Almost expired</Text>}
        {isExpiringSoon && <Text style={styles.soonText}>⏳ Expiring Soon</Text>}

        <View style={styles.row}>
          <Text style={styles.countdownText}>
            {countdowns[item.id]?.days || 0}d {countdowns[item.id]?.hours || 0}h{' '}
            {countdowns[item.id]?.minutes || 0}m {countdowns[item.id]?.seconds || 0}s
          </Text>

          <View style={styles.iconRow}>
            {/* ❤️ Favorite toggle */}
            <TouchableOpacity
              onPress={() =>
                isFavorite(item.id)
                  ? removeFromFavorites(item.id)
                  : addToFavorites(item)
              }
            >
              <Ionicons
                name={isFavorite(item.id) ? 'heart' : 'heart-outline'}
                size={22}
                color="red"
              />
            </TouchableOpacity>

            {/* 🛒 Add to Cart */}
            <TouchableOpacity
              onPress={() => {
                addToCart(item);
                navigation.navigate('CartScreen');
              }}
            >
              <Ionicons name="cart-outline" size={22} color="green" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Favorite List ❤️</Text>

      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>No favorite items yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={styles.listContainer}
          ListFooterComponent={<View style={{ height: 80 }} />}
        />
      )}

      <BottomTab />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#222' },
  emptyText: { textAlign: 'center', fontSize: 16, color: 'gray', marginTop: 50 },
  listContainer: { paddingBottom: 120 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: { width: '100%', height: 100, borderRadius: 10, marginBottom: 8 },
  name: { fontSize: 15, fontWeight: 'bold', marginBottom: 5 },
  oldPrice: { textDecorationLine: 'line-through', color: '#888' },
  newPrice: { color: '#144D3C', fontWeight: 'bold', fontSize: 16 },
  urgentText: { color: 'red', fontWeight: 'bold', marginTop: 5, fontSize: 12 },
  soonText: { color: 'orange', fontWeight: 'bold', marginTop: 5, fontSize: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  countdownText: { fontSize: 13, color: '#555' },
  iconRow: { flexDirection: 'row', gap: 10 },
});
