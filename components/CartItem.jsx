import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CartItem({ item, onPress, onIncrease, onDecrease, onRemove }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Product Image */}
      <Image source={item.image} style={styles.image} />

      {/* Product Details */}
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>

        <View style={styles.priceContainer}>
          {item.oldPrice && (
            <Text style={styles.oldPrice}>LKR {item.oldPrice}</Text>
          )}
          <Text style={styles.price}>LKR {item.price}</Text>
        </View>

        {/* Quantity Controls */}
        <View style={styles.qtyContainer}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => onDecrease(item.id)}>
            <Ionicons name="remove" size={16} color="#555" />
          </TouchableOpacity>

          <Text style={styles.qtyText}>{item.quantity}</Text>

          <TouchableOpacity style={styles.qtyBtn} onPress={() => onIncrease(item.id)}>
            <Ionicons name="add" size={16} color="#555" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Delete Icon */}
      <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.trashIcon}>
        <Ionicons name="trash-outline" size={22} color="#ff4d4d" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    width: 70,
    height: 90,
    resizeMode: 'contain',
    borderRadius: 10,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    color: '#999',
    marginRight: 6,
    fontSize: 12,
  },
  price: {
    fontWeight: '700',
    fontSize: 15,
    color: '#1e90ff',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  qtyBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#f8f8f8',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '500',
  },
  trashIcon: {
    marginLeft: 10,
  },
});
