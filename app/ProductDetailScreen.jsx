import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

export default function ProductDetailScreen() {
  const { product } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const productData = product ? JSON.parse(product) : {};

  const handleAddToCart = () => {
    if (!productData.id) return;
    addToCart(productData);
    Alert.alert('Added to Cart', `${productData.name || 'Product'} has been added to your cart.`);
    router.push('/CartScreen');
  };

  const handleBuyNow = () => {
    if (!productData.id) return;
    router.push({
      pathname: '/CheckoutScreen',
      params: { product: JSON.stringify(productData) },
    });
  };

  const handleAIHealthAnalysis = () => {
    if (!productData.id) {
      Alert.alert('Error', 'Product ID not found');
      return;
    }
    router.push({
      pathname: '/AIHealthAnalysisScreen',
      params: { id: productData.id },
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={26} color="#000" />
      </TouchableOpacity>

      {/* Product Image */}
      {productData.image ? (
        <Image source={{ uri: productData.image }} style={styles.image} resizeMode="contain" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text>No Image Available</Text>
        </View>
      )}

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <View style={styles.priceRow}>
          <Text style={styles.discountPrice}>LKR {productData.discount_price ?? '-'}</Text>
          <Text style={styles.originalPrice}>LKR {productData.price ?? '-'}</Text>
        </View>

        <Text style={styles.title}>{productData.name ?? 'Unnamed Product'}</Text>
        <Text style={styles.description}>{productData.description ?? 'No description available.'}</Text>

        {productData.ingredients && (
          <Text style={styles.ingredients}>
            <Text style={{ fontWeight: 'bold' }}>Ingredients: </Text>
            {productData.ingredients}
          </Text>
        )}

        {productData.expire_date && (
          <Text style={styles.expireDate}>
            <Text style={{ fontWeight: 'bold' }}>Expire Date: </Text>
            {new Date(productData.expire_date).toLocaleDateString()}
          </Text>
        )}
      </View>

      {/* Buy & Add to Cart Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.buyNow]} onPress={handleBuyNow}>
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.addToCart]} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>

      {/* AI Health Analysis Button */}
      <TouchableOpacity style={styles.aiButton} onPress={handleAIHealthAnalysis}>
        <Ionicons name="fitness-outline" size={22} color="#fff" />
        <Text style={styles.aiButtonText}>AI Health Analysis</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  backButton: { marginTop: 50, marginBottom: 10, alignSelf: 'flex-start' },
  image: { width: '100%', height: 300, alignSelf: 'center', borderRadius: 16, backgroundColor: '#f2f2f2' },
  imagePlaceholder: { justifyContent: 'center', alignItems: 'center' },
  infoContainer: { marginTop: 20, paddingHorizontal: 10 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  discountPrice: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  originalPrice: { fontSize: 16, color: 'gray', textDecorationLine: 'line-through', marginLeft: 5 },
  title: { fontSize: 18, fontWeight: '600', marginTop: 8 },
  description: { fontSize: 14, color: '#555', marginTop: 6, lineHeight: 20 },
  ingredients: { fontSize: 14, color: '#444', marginTop: 10, lineHeight: 20 },
  expireDate: { fontSize: 15, marginTop: 12, color: '#000' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 50,
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buyNow: { backgroundColor: '#1C4D3A' },
  addToCart: { backgroundColor: '#6A1C1B' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  aiButton: {
    flexDirection: 'row',
    backgroundColor: '#0A3D62',
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    marginHorizontal: 12,
  },
  aiButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
});
