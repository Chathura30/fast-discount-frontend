import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoriteContext";
import { router } from "expo-router";
import BottomTab from "../components/BottomTab";

const BASE_URL = "http://172.20.10.7:5000";

export default function CartScreen() {
  const { cartItems: globalCartItems, removeFromCart, updateQuantity } = useCart();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  const [cartItems, setCartItems] = useState([]);
  const [countdowns, setCountdowns] = useState({});

  // Initialize local cart state
  useEffect(() => {
    setCartItems(
      globalCartItems.map((item) => ({
        ...item,
        quantity: item.quantity || 1,
      }))
    );
  }, [globalCartItems]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updated = {};

      cartItems.forEach((item) => {
        const diff = new Date(item.expire_date) - now;
        if (diff > 0) {
          updated[item.id] = {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
          };
        }
      });

      setCountdowns(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [cartItems]);

  // Update quantity
  const handleQuantityChange = (id, quantity) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
    updateQuantity(id, quantity);
  };

  const renderCartItem = ({ item }) => {
    const imageUri = item.image
      ? { uri: item.image.startsWith("http") ? item.image : `${BASE_URL}${item.image}` }
      : { uri: "https://via.placeholder.com/150" };

    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/ProductDetailScreen",
              params: { product: JSON.stringify(item) },
            })
          }
        >
          <Image source={imageUri} style={styles.image} />
        </TouchableOpacity>

        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.oldPrice}>LKR {item.price}</Text>
        <Text style={styles.newPrice}>LKR {item.discount_price}</Text>

        <Text style={styles.countdownText}>
          {countdowns[item.id]?.days || 0}d {countdowns[item.id]?.hours || 0}h{" "}
          {countdowns[item.id]?.minutes || 0}m {countdowns[item.id]?.seconds || 0}s
        </Text>

        <View style={styles.row}>
          {/* Quantity */}
          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() =>
                handleQuantityChange(item.id, Math.max(item.quantity - 1, 1))
              }
            >
              <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.qtyValue}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
            >
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Icons */}
          <View style={styles.iconRow}>
            <TouchableOpacity
              onPress={() =>
                isFavorite(item.id)
                  ? removeFromFavorites(item.id)
                  : addToFavorites(item)
              }
            >
              <Ionicons
                name={isFavorite(item.id) ? "heart" : "heart-outline"}
                size={22}
                color="red"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                removeFromCart(item.id);
                setCartItems((prev) => prev.filter((i) => i.id !== item.id));
              }}
            >
              <Ionicons name="trash-outline" size={22} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.discount_price || 0) * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cart 🛒</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cartItems}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={styles.listContainer}
          ListFooterComponent={
            <View style={styles.footer}>
              <Text style={styles.totalText}>Total: LKR {total}</Text>

              {/* Checkout */}
              <TouchableOpacity
                style={styles.checkoutBtn}
                onPress={() =>
                  router.push({
                    pathname: "/CheckoutScreen",
                    params: {
                      cartItems: JSON.stringify(cartItems),
                      total,
                    },
                  })
                }
              >
                <Text style={styles.checkoutText}>Checkout</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      <BottomTab />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 20 },
  title: { fontSize: 24, textAlign: "center", fontWeight: "bold", marginBottom: 15, color: "#222" },
  emptyText: { textAlign: "center", fontSize: 16, color: "gray", marginTop: 50 },
  listContainer: { paddingBottom: 120 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    width: "48%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: { width: "100%", height: 100, borderRadius: 10, marginBottom: 8 },
  name: { fontSize: 15, fontWeight: "bold", marginBottom: 5 },
  oldPrice: { textDecorationLine: "line-through", color: "#888" },
  newPrice: { color: "#144D3C", fontWeight: "bold", fontSize: 16 },
  countdownText: { fontSize: 13, color: "#555", marginVertical: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6 },
  iconRow: { flexDirection: "row", gap: 10 },
  quantityRow: { flexDirection: "row", alignItems: "center" },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: { fontSize: 16, fontWeight: "bold" },
  qtyValue: { marginHorizontal: 8, fontSize: 16, fontWeight: "bold" },
  footer: {
    backgroundColor: "#E8F5E9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
  },
  totalText: { fontSize: 18, fontWeight: "bold", color: "green" },
  checkoutBtn: {
    backgroundColor: "#007B5F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
