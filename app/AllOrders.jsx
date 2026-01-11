import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";

const BASE_URL = "http://172.20.10.7:5000/api/orders";
const SERVER_URL = "http://172.20.10.7:5000";

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("today"); // today | confirm
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  /** Fetch Orders based on selected tab */
  const fetchOrders = async () => {
    try {
      const endpoint =
        activeTab === "today"
          ? `${BASE_URL}/admin/orders`
          : `${BASE_URL}/admin/confirmed`;

      const res = await axios.get(endpoint);
      setOrders(res.data.orders || []);
    } catch (error) {
      console.log("Error fetching:", error);
    }
  };

  /** Render Each Order Card */
  const renderItem = ({ item }) => {
    // Parse items if it's a string, otherwise use as-is
    const orderItems = typeof item.items === 'string' 
      ? JSON.parse(item.items) 
      : (Array.isArray(item.items) ? item.items : []);
    
    // Get first product image
    const firstProduct = orderItems[0];
    let productImage = 'https://via.placeholder.com/70';
    
    if (firstProduct && firstProduct.image) {
      if (firstProduct.image.startsWith('http')) {
        productImage = firstProduct.image;
      } else if (firstProduct.image.startsWith('/')) {
        productImage = `${SERVER_URL}${firstProduct.image}`;
      } else {
        productImage = `${SERVER_URL}/${firstProduct.image}`;
      }
    }

    return (
      <TouchableOpacity
        style={styles.orderBox}
        onPress={() => router.push(`/Order-Details?orderId=${item.id}`)}
      >
        <View style={styles.row}>
          <Image
            source={{ uri: productImage }}
            style={styles.productImage}
            resizeMode="cover"
          />

          <View style={styles.info}>
            <Text style={styles.title}>Order #{item.id}</Text>
            <Text style={styles.customer}>Customer: {item.customer_name}</Text>
            <Text style={styles.qty}>Items: {orderItems.length}</Text>
            <Text style={styles.price}>Total: LKR {item.total_amount}</Text>
            <Text style={styles.payment}>Payment: {item.payment_method}</Text>
            <Text style={[styles.status, item.status === 'Pending' && {color: 'orange'}]}>
              Status: {item.status}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} onPress={() => router.back()} />
        <Text style={styles.headerText}>Customer Orders</Text>
        <Ionicons name="filter" size={24} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab("today")}>
          <Text
            style={
              activeTab === "today" ? styles.activeTab : styles.inactiveTab
            }
          >
            Today Orders
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveTab("confirm")}>
          <Text
            style={
              activeTab === "confirm" ? styles.activeTab : styles.inactiveTab
            }
          >
            Confirm Delivery
          </Text>
        </TouchableOpacity>
      </View>

      {/* Order List */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 30 }}>
            No Orders Found
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#FFF" },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerText: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "700" },

  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },

  activeTab: {
    fontSize: 16,
    color: "#000",
    fontWeight: "700",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    paddingBottom: 5,
  },

  inactiveTab: {
    fontSize: 16,
    color: "#999",
    paddingBottom: 5,
  },

  orderBox: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    marginBottom: 15,
  },
  row: { flexDirection: "row" },
  productImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  info: { marginLeft: 10, flex: 1 },
  title: { fontSize: 16, fontWeight: "600" },
  customer: { marginTop: 4, fontSize: 14, color: '#555' },
  qty: { marginTop: 4, fontSize: 14 },
  price: { marginTop: 4, fontSize: 14, fontWeight: "600" },
  payment: { marginTop: 4, fontSize: 14 },
  status: { marginTop: 4, color: "green", fontWeight: "700" },
});
