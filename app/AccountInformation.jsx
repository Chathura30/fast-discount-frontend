import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function AccountInformation() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const data = await AsyncStorage.getItem("user");
    if (data) {
      const user = JSON.parse(data);
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || ""
      });
    }
  };


  // Validation
 
  const validateForm = () => {
    if (!form.name.trim()) {
      Alert.alert("Validation Error", "Full Name is required");
      return false;
    }

    if (!form.phone.trim()) {
      Alert.alert("Validation Error", "Phone Number is required");
      return false;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      Alert.alert(
        "Invalid Phone Number",
        "Phone Number must contain exactly 10 digits"
      );
      return false;
    }

    if (!form.address.trim()) {
      Alert.alert("Validation Error", "Address is required");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const userData = {
      id: 1,
      name: form.name,
      phone: form.phone,
      address: form.address,
    };

    await AsyncStorage.setItem("user", JSON.stringify(userData));

    Alert.alert("Success", "Account information updated");
    router.back();
  };

  return (
    <View style={styles.container}>

      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={26} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Account Information</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#00000099"
        value={form.name}
        onChangeText={(t) => setForm({ ...form, name: t })}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#00000099"
        keyboardType="numeric"
        maxLength={10}
        value={form.phone}
        onChangeText={(t) => setForm({ ...form, phone: t })}
      />

      <TextInput
        style={[styles.input, styles.addressInput]}
        placeholder="Address"
        placeholderTextColor="#00000099"
        multiline
        value={form.address}
        onChangeText={(t) => setForm({ ...form, address: t })}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveTxt}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#fff" },

  backBtn: {
    marginBottom: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center"
  },

  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },

  input: {
    backgroundColor: "#F1F1F1",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },

  addressInput: {
    height: 90,
    textAlignVertical: "top"
  },

  saveBtn: {
    backgroundColor: "#5C1A18",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },

  saveTxt: { color: "#fff", textAlign: "center", fontSize: 17, fontWeight: "600" },
});
