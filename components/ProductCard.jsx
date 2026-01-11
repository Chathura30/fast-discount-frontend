import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProductCard({ 
  title, 
  price, 
  oldPrice, 
  countdown, 
  image, 
  favorite = false,
  onAddToCart,
  onToggleFavorite
}) {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const [isFavorite, setIsFavorite] = useState(favorite);

  //  Countdown for Today Only deal
  useEffect(() => {
    if (!countdown) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Format HH:MM:SS
  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <View style={[styles.card, countdown && styles.dealCard]}>
      
      {/* Product Image */}
      {image && <Image source={{ uri: image }} style={styles.image} />}
      
      <View style={styles.details}>
        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Price Section */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>LKR {price}</Text>
          {oldPrice && <Text style={styles.oldPrice}>LKR {oldPrice}</Text>}
        </View>

        {/*  Countdown (Only for Today Only) */}
        {countdown && (
          <Text style={styles.countdown}> {formatTime(timeLeft)}</Text>
        )}
      </View>

      {/* Right side actions */}
      {!countdown && (
        <View style={styles.actions}>
          {/* Favorite Heart */}
          <TouchableOpacity onPress={() => {
            setIsFavorite(!isFavorite);
            onToggleFavorite && onToggleFavorite(!isFavorite);
          }}>
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={22} 
              color={isFavorite ? "#E53935" : "#555"} 
              style={{ marginBottom: 10 }}
            />
          </TouchableOpacity>

          {/* Add (+) */}
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={onAddToCart}
          >
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  dealCard: {
    flexDirection: 'column', // special style for Today Only
    alignItems: 'flex-start',
  },
  image: { 
    width: 70, 
    height: 70, 
    borderRadius: 12, 
    marginRight: 12 
  },
  details: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  priceContainer: { flexDirection: 'row', alignItems: 'center' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#144D3C', marginRight: 10 },
  oldPrice: { fontSize: 14, color: '#888', textDecorationLine: 'line-through' },
  countdown: { marginTop: 5, fontSize: 14, color: '#D9534F' },

  // Extra buttons for normal cards
  actions: { justifyContent: 'center', alignItems: 'center' },
  addButton: {
    backgroundColor: '#144D3C',
    borderRadius: 20,
    padding: 5,
  },
});
