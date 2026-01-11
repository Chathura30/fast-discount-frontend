import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function HelpPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Top Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help</Text>
      </View>

      {/* Welcome Banner */}
      <View style={styles.banner}>
        <View>
          <Text style={styles.welcomeTitle}>Welcome</Text>
          <Text style={styles.welcomeSub}>
            to Fast Discount Help center
          </Text>
        </View>

        <Image
         source={require("../assets/images/adaptive-icon7.png")} 
          style={styles.bannerImage}
        />
      </View>

      {/* Phone Numbers */}
      <View style={styles.phoneBox}>
        <Text style={styles.phoneText}>0112233445 / 0773456535</Text>
      </View>

      {/* Contact Customer Care Card */}
      <View style={styles.card}>
        <View style={styles.cardIconRow}>
          <Ionicons name="people-circle" size={40} color="#6B2F1C" />
          <Text style={styles.cardTitle}>Contact Customer Care</Text>
        </View>

        <Text style={styles.cardSubtitle}>Fast Discount, Our Assistant</Text>
        <Text style={styles.cardTime}>7am - 9pm Monday to Sunday</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginLeft: 10,
  },

  // Banner styles
  banner: {
    backgroundColor: "#0D5C4A",
    padding: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  welcomeTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  welcomeSub: {
    color: "white",
    fontSize: 14,
    opacity: 0.9,
  },
  bannerImage: {
    width: 200,
    height: 150,
    resizeMode: "contain",
  },

  phoneBox: {
    marginTop: 15,
    alignItems: "center",
  },
  phoneText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6B2F1C",
  },

  // Customer care card
  card: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    borderWidth: 0.8,
    borderColor: "#ddd",
  },
  cardIconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },
  cardSubtitle: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  cardTime: {
    marginTop: 3,
    fontSize: 14,
    opacity: 0.7,
  },
});
