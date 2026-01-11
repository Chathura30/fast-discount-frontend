import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CardPaymentScreen() {
  const { total, cartItems } = useLocalSearchParams();
  const [user, setUser] = useState(null);

  const amount = total ? parseFloat(total) : 0;
  const items = cartItems ? JSON.parse(cartItems) : [];

  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Load user info from AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
    };
    loadUser();
  }, []);

  const handlePayNow = async () => {
    if (!user) {
      Alert.alert("Error", "User information not found. Please login again.");
      return;
    }

    if (!nameOnCard || !cardNumber || !expiry || !cvv) {
      Alert.alert("Missing Info", "Please enter all card details.");
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
          payment_method: "Card",
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
            paymentMethod: "Credit / Debit Card",
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
        <Text style={styles.title}>Credit / Debit Card</Text>
      </View>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Name on Card"
        placeholderTextColor="#999"
        value={nameOnCard}
        onChangeText={setNameOnCard}
      />

      <TextInput
        style={styles.input}
        placeholder="Card Number"
        placeholderTextColor="#999"
        keyboardType="number-pad"
        maxLength={16}
        value={cardNumber}
        onChangeText={setCardNumber}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 10 }]}
          placeholder="Expiry (MM/YY)"
          placeholderTextColor="#999"
          maxLength={5}
          value={expiry}
          onChangeText={setExpiry}
        />

        <TextInput
          style={[styles.input, { width: 90 }]}
          placeholder="CVV"
          placeholderTextColor="#999"
          secureTextEntry
          keyboardType="number-pad"
          maxLength={3}
          value={cvv}
          onChangeText={setCvv}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total Amount</Text>
          <Text style={styles.totalValue}>LKR {amount}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handlePayNow}>
          <Text style={styles.buttonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },

  input: {
    height: 50,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 15,
    fontSize: 15,
  },

  row: {
    flexDirection: "row",
    marginBottom: 12,
  },

  footer: {
    marginTop: "auto",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  totalText: { fontSize: 16 },
  totalValue: { fontSize: 16, fontWeight: "bold" },

  button: {
    backgroundColor: "#5A1F1F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
