import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const BASE_URL = 'http://172.20.10.7:5000';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (!userData) {
        console.log("No user data found");
        setOrders([]);
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      console.log("Loading orders for user:", user.id);

      const res = await fetch(
        `${BASE_URL}/api/orders/user/${user.id}`
      );
      const data = await res.json();

      console.log("Orders response:", data);

      if (data.success && Array.isArray(data.orders)) {
        const safeOrders = data.orders.map((order) => ({
          ...order,
          items: Array.isArray(order.items) ? order.items : [],
        }));
        setOrders(safeOrders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error loading orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5A1F1F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Orders</Text>

        <View style={{ width: 26 }} />
      </View>

      {/* Orders List */}
      {orders.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: "#555" }}>No orders found.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id || item._id)}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <Text style={styles.orderTitle}>
                Order #{item.id || item._id || ""}
              </Text>

              <Text>Status: {item.status || "Unknown"}</Text>
              <Text>
                Total: LKR{" "}
                {item.total_amount != null ? item.total_amount : 0}
              </Text>
              <Text>
                Payment: {item.payment_method || "Not Available"}
              </Text>

              {/* Product List */}
              {item.items.length > 0 ? (
                item.items.map((product, index) => {
                  // Construct proper image URL
                  let imageUri = 'https://via.placeholder.com/80';
                  
                  if (product.image) {
                    if (product.image.startsWith('http')) {
                      imageUri = product.image;
                    } else if (product.image.startsWith('/')) {
                      imageUri = `${BASE_URL}${product.image}`;
                    } else {
                      imageUri = `${BASE_URL}/${product.image}`;
                    }
                  }

                  console.log('Product:', product.product_name, 'Image Path:', product.image, 'Final URI:', imageUri);

                  return (
                    <View key={index} style={styles.productRow}>
                      <Image
                        source={{ uri: imageUri }}
                        style={styles.productImage}
                        resizeMode="cover"
                        onError={(e) => console.log('Image load error:', imageUri, e.nativeEvent.error)}
                      />

                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.productName}>
                          {product.product_name || "Unnamed Product"}
                        </Text>

                        <Text style={styles.productDetail}>
                          Qty:{" "}
                          {product.quantity != null ? product.quantity : 0}
                        </Text>

                        <Text style={styles.productDetail}>
                          Price: LKR{" "}
                          {product.price != null ? product.price : 0}
                        </Text>
                      </View>
                    </View>
                  );
                })
              ) : (
                <Text style={{ marginTop: 10, color: "#555" }}>
                  No products in this order.
                </Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  orderCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#eee",
  },

  productName: {
    fontSize: 16,
    fontWeight: "500",
  },

  productDetail: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
});
