import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function OrderSuccessScreen() {
  const params = useLocalSearchParams();
  const cartItems = params.cartItems ? JSON.parse(params.cartItems) : [];
  const total = params.total ? parseFloat(params.total) : 0;
  const paymentMethod = params.paymentMethod || "";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Order Placed Successfully!</Text>

      <Text style={styles.subtitle}>Payment Method: {paymentMethod}</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
            <Text style={styles.itemPrice}>LKR {item.discount_price * item.quantity}</Text>
          </View>
        )}
      />

      <Text style={styles.total}>Total Paid: LKR {total}</Text>

      <TouchableOpacity style={styles.homeButton} onPress={() => router.push("/HomeScreen")}>
        <Text style={styles.homeButtonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  subtitle: { fontSize: 16, marginBottom: 20, textAlign: "center" },
  itemRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 5 },
  itemName: { flex: 1 },
  itemQty: { width: 70, textAlign: "center" },
  itemPrice: { width: 80, textAlign: "right" },
  total: { fontSize: 18, fontWeight: "bold", marginTop: 20, textAlign: "center" },
  homeButton: {
    backgroundColor: "#1C4D3A",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  homeButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
