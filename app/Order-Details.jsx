import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";

const BASE_URL = "http://172.20.10.7:5000/api/orders";
const SERVER_URL = "http://172.20.10.7:5000";

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/details/${orderId}`);
      console.log("Order API response:", res.data);
      
      if (res.data.success && res.data.order) {
        setOrder(res.data.order);
      }
    } catch (err) {
      console.log("Error loading order:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelivery = async () => {
    try {
      await axios.put(`${BASE_URL}/admin/confirm/${orderId}`);
      router.push({
        pathname: "/admin/confirm",//Alert 
        params: { orderId },
      });
    } catch (error) {
      console.log("Error confirming delivery:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5C1A18" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 16, color: "#555" }}>Order not found.</Text>
      </View>
    );
  }

  // Parse items if it's a JSON string
  let items = [];
  if (typeof order.items === 'string') {
    try {
      items = JSON.parse(order.items);
    } catch (e) {
      console.log("Error parsing items:", e);
    }
  } else if (Array.isArray(order.items)) {
    items = order.items;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Order Details</Text>
      </View>

      {/* Product Items List */}
      <Text style={styles.sectionTitle}>Ordered Products</Text>

      {items.length > 0 ? (
        items.map((item, index) => {
          // Construct proper image URL
          let imageUri = 'https://via.placeholder.com/70';
          
          if (item.image) {
            if (item.image.startsWith('http')) {
              imageUri = item.image;
            } else if (item.image.startsWith('/')) {
              imageUri = `${SERVER_URL}${item.image}`;
            } else {
              imageUri = `${SERVER_URL}/${item.image}`;
            }
          }

          return (
            <View key={index} style={styles.itemBox}>
              <Image
                source={{ uri: imageUri }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.product_name || "N/A"}</Text>
                <Text style={styles.qty}>Qty: {item.quantity || 0}</Text>
                <Text style={styles.price}>Price: LKR {item.price || 0}</Text>
              </View>
            </View>
          );
        })
      ) : (
        <Text style={{ fontSize: 16, color: "#555" }}>No items found.</Text>
      )}

      {/* Customer Section */}
      <Text style={styles.sectionTitle}>Customer Details</Text>

      <View style={styles.customerBox}>
        <Ionicons name="person-circle-outline" size={45} color="#4A90E2" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.customerName}>
            {order.customer_name || "N/A"}
          </Text>
          <Text style={styles.customerInfo}>
            {order.customer_number || "N/A"}
          </Text>
          <Text style={styles.customerInfo}>
            {order.customer_address || "N/A"}
          </Text>
        </View>
      </View>

      {/* Total Amount */}
      <View style={styles.totalBox}>
        <Text style={styles.totalText}>
          Total Amount: LKR {order.total_amount || 0}
        </Text>
        <Text style={styles.paymentMethod}>
          Payment: {order.payment_method || "N/A"}
        </Text>
      </View>

      {/* Confirm Delivery Button */}
      <TouchableOpacity style={styles.confirmBtn} onPress={confirmDelivery}>
        <Text style={styles.confirmText}>Confirm Delivery</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#FFF" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    marginRight: 25,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 10,
  },

  itemBox: {
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#DDD",
  },

  productImage: { 
    width: 70, 
    height: 70, 
    marginRight: 15, 
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },

  title: { fontSize: 16, fontWeight: "700" },
  qty: { fontSize: 14, color: "#555" },
  price: { fontSize: 15, fontWeight: "700", marginTop: 5 },

  customerBox: {
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 20,
  },

  customerName: { fontSize: 17, fontWeight: "700" },
  customerInfo: { fontSize: 14, color: "#555" },

  totalBox: {
    padding: 15,
    backgroundColor: "#F3F3F3",
    borderRadius: 12,
    marginBottom: 25,
  },

  totalText: { fontSize: 18, fontWeight: "700" },
  paymentMethod: { fontSize: 16, marginTop: 5, color: "#444" },

  confirmBtn: {
    backgroundColor: "#5C1A18",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
  },

  confirmText: { color: "#FFF", fontSize: 17, fontWeight: "700" },
});
