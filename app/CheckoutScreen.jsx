import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Accept cartItems[] OR single product
  const initialCartItems = params.cartItems
    ? JSON.parse(params.cartItems)
    : params.product
    ? [JSON.parse(params.product)]
    : [];

  const [cartItems, setCartItems] = useState(
    initialCartItems.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }))
  );

  // HANDLE QUANTITY CHANGES
  const handleQuantityChange = (id, newQty) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  // PRICE CALCULATIONS
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.discount_price || 0) * item.quantity,
    0
  );
  const discount = 50;
  const deliveryFee = 50;
  const grandTotal = subtotal - discount + deliveryFee;

  // RENDER EACH ITEM
  const renderItem = ({ item }) => (
    <View style={styles.productRow}>
      <Image
        source={{
          uri: item.image.startsWith("http")
            ? item.image
            : `http://172.20.10.7:5000${item.image}`,
        }}
        style={styles.image}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.price}>LKR {item.discount_price}</Text>

        {/* Quantity Controls */}
        <View style={styles.qtyRow}>
          <TouchableOpacity
            onPress={() =>
              handleQuantityChange(item.id, Math.max(1, item.quantity - 1))
            }
          >
            <Ionicons name="remove" size={22} />
          </TouchableOpacity>

          <Text style={styles.qtyText}>{item.quantity}</Text>

          <TouchableOpacity
            onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
          >
            <Ionicons name="add" size={22} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Checkout</Text>
        </View>

        {/* PRODUCTS LIST */}
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />

        {/* ADDRESS */}
        <TouchableOpacity
          style={styles.addressBox}
          onPress={() => router.push("/AddAddress")}
        >
          <Ionicons name="location-outline" size={24} />
          <Text style={styles.addressText}>Add Delivery Address</Text>
          <Ionicons name="chevron-forward" size={20} />
        </TouchableOpacity>

        {/* SUMMARY */}
        <View style={styles.summaryBox}>
          <View style={styles.row}>
            <Text>Subtotal</Text>
            <Text>LKR {subtotal}</Text>
          </View>

          <View style={styles.row}>
            <Text>Discount</Text>
            <Text>LKR {discount}</Text>
          </View>

          <View style={styles.row}>
            <Text>Delivery Fee</Text>
            <Text>LKR {deliveryFee}</Text>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: LKR {grandTotal}</Text>

        <TouchableOpacity
          style={styles.orderButton}
          onPress={() =>
            router.push({
              pathname: "/PaymentMethodScreen",
              params: {
                cartItems: JSON.stringify(cartItems),
                total: grandTotal,
              },
            })
          }
        >
          <Text style={styles.orderButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  headerText: { fontSize: 22, fontWeight: "bold", marginLeft: 10 },
  productRow: { flexDirection: "row", marginTop: 20 },
  image: { width: 90, height: 90, marginRight: 10, borderRadius: 10 },
  productName: { fontSize: 16, fontWeight: "bold" },
  price: { marginTop: 5, fontSize: 16, fontWeight: "bold" },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
  qtyText: { fontSize: 16, fontWeight: "bold" },
  addressBox: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  addressText: { flex: 1 },
  summaryBox: { marginTop: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },

  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalText: { fontSize: 18, fontWeight: "bold" },

  orderButton: {
    backgroundColor: "#7b0e0e",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  orderButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
