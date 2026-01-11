import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CashOnDeliveryScreen() {
  const { total, cartItems } = useLocalSearchParams();
  const [user, setUser] = useState(null);

  const amount = total ? parseFloat(total) : 0;
  const items = cartItems ? JSON.parse(cartItems) : [];

  // Load user info from AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
    };
    loadUser();
  }, []);

  const handleConfirmOrder = async () => {
    if (!user) {
      Alert.alert("Error", "User information not found. Please login again.");
      return;
    }

    if (!items.length) {
      Alert.alert("Cart Empty", "Please add products to your cart.");
      return;
    }

    try {
      const response = await fetch("http://172.20.10.7:5000/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: user.id,
          customer_name: user.name,
          customer_number: user.phone,
          customer_address: user.address,
          total_amount: amount,
          payment_method: "CashOnDelivery",
          items: items.map(item => ({
            product_id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.discount_price || item.price,
            image: item.image || "",
          })),
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Order created successfully!");
        router.push({
          pathname: "/OrderSuccessScreen",
          params: {
            orderId: data.orderId,
            total: amount,
            cartItems: JSON.stringify(items),
            paymentMethod: "Cash on Delivery",
          },
        });
      } else {
        Alert.alert("Error", data.message || "Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} />
        </TouchableOpacity>
        <Text style={styles.title}>Cash on Delivery</Text>
      </View>

      {/* Total Amount */}
      <Text style={styles.amountText}>Total Amount: LKR {amount}</Text>

      <Image
        source={require("../assets/images/adaptive-icon6.png")}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          You can pay the full amount in cash when your order is delivered to your address.
        </Text>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmOrder}>
        <Text style={styles.confirmText}>Confirm Order</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  image: { width: "100%", height: 350, marginVertical: 80, alignSelf: "center" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
  },

  amountText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },

  infoBox: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fafafa",
  },

  infoText: {
    fontSize: 15,
    color: "#444",
  },

  confirmBtn: {
    backgroundColor: "#6A1C1B",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },

  confirmText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});
