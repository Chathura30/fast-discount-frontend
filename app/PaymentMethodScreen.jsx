import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

export default function PaymentMethodScreen() {
  const params = useLocalSearchParams();

  const cartItems = params.cartItems ? JSON.parse(params.cartItems) : [];
  const total = params.total ? parseFloat(params.total) : 0;

  // Navigate to CardPaymentScreen or CashOnDeliveryScreen
  const handlePaymentSelect = (screenName) => {
    router.push({
      pathname: `/${screenName}`,
      params: {
        total: total,
        cartItems: JSON.stringify(cartItems),
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Payment Method</Text>
      </View>

      {/* Credit/Debit Card */}
      <TouchableOpacity
        style={styles.option}
        onPress={() => handlePaymentSelect("CardPaymentScreen")}
      >
        <Ionicons name="card-outline" size={26} />
        <View style={styles.optionTextBox}>
          <Text style={styles.optionTitle}>Credit/Debit Card</Text>
          <Text style={styles.optionSub}>Pay using your bank card</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} />
      </TouchableOpacity>

      {/* Cash on Delivery */}
      <TouchableOpacity
        style={styles.option}
        onPress={() => handlePaymentSelect("CashOnDeliveryScreen")}
      >
        <Ionicons name="cash-outline" size={26} />
        <View style={styles.optionTextBox}>
          <Text style={styles.optionTitle}>Cash on Delivery</Text>
          <Text style={styles.optionSub}>Pay when your order arrives</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

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

  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 15,
  },

  optionTextBox: {
    marginLeft: 15,
    flex: 1,
  },

  optionTitle: {
    fontSize: 17,
    fontWeight: "600",
  },

  optionSub: {
    fontSize: 13,
    color: "#777",
  },
});
