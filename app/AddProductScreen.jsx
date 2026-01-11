import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export default function AddProductScreen() {
  const navigation = useNavigation();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---------- IMAGE PICKER ----------
  const pickImage = async () => {
    Alert.alert("Select Image", "Choose an option", [
      {
        text: "Camera",
        onPress: async () => {
          const permission = await ImagePicker.requestCameraPermissionsAsync();
          if (!permission.granted) return Alert.alert("Allow camera access");

          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.7,
          });

          if (!result.canceled) setImage(result.assets[0].uri);
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!permission.granted)
            return Alert.alert("Allow gallery access");

          const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.7,
          });

          if (!result.canceled) setImage(result.assets[0].uri);
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // ---------- VALIDATIONS ----------
  const validateFields = () => {
    const codePattern = /^P\d{5}$/; // P00001 format

    if (!codePattern.test(code)) {
      Alert.alert("Invalid Code", "Product code must follow format: P00001");
      return false;
    }

    if (!name.trim()) {
      Alert.alert("Missing Name", "Product name is required.");
      return false;
    }

    if (!expireDate) {
      Alert.alert("Missing Expiry Date", "Please select an expiry date.");
      return false;
    }

    if (isNaN(price)) {
      Alert.alert("Invalid Price", "Price must be numeric.");
      return false;
    }

    if (discountPrice && isNaN(discountPrice)) {
      Alert.alert("Invalid Discount Price", "Discount price must be numeric.");
      return false;
    }

    return true;
  };

  // ---------- ADD PRODUCT ----------
  const handleAddProduct = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("code", code);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("expire_date", expireDate);
      formData.append("price", price);
      formData.append("discount_price", discountPrice);

      if (image) {
        const filename = image.split("/").pop();
        const fileType = filename.split(".").pop();

        formData.append("image", {
          uri: image,
          name: filename,
          type: `image/${fileType}`,
        });
      }

      await axios.post("http://172.20.10.7:5000/api/products/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Alert.alert("Success", "Product added successfully!");
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ---------- HEADER ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
      </View>

      {/* ---------- PRODUCT CODE ---------- */}
      <TextInput
        style={styles.input}
        placeholder="Product Code (P00001)"
        placeholderTextColor="#555"
        value={code}
        onChangeText={setCode}
      />

      {/* ---------- PRODUCT NAME ---------- */}
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        placeholderTextColor="#555"
        value={name}
        onChangeText={setName}
      />

      {/* ---------- IMAGE PICKER ---------- */}
      <TouchableOpacity style={styles.imageInput} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.previewImage} />
        ) : (
          <>
            <Text style={{ color: "#999", flex: 1 }}>
              Select or Capture Product Image
            </Text>
            <Ionicons name="camera-outline" size={24} color="#999" />
          </>
        )}
      </TouchableOpacity>

      {/* ---------- DESCRIPTION ---------- */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Product Description"
        placeholderTextColor="#555"
        multiline
        numberOfLines={3}
        value={description}
        onChangeText={setDescription}
      />

      {/* ---------- DATE PICKER ---------- */}
      <TouchableOpacity
        style={styles.datePicker}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={{ color: expireDate ? "#000" : "#999" }}>
          {expireDate || "Select Expiry Date"}
        </Text>
        <Ionicons name="calendar-outline" size={22} color="#666" />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          minimumDate={new Date()} // cannot select past dates
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              const formatted = selectedDate.toISOString().split("T")[0];
              setExpireDate(formatted);
            }
          }}
        />
      )}

      {/* ---------- PRICE ---------- */}
      <TextInput
        style={styles.input}
        placeholder="Product Price"
        placeholderTextColor="#555"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      {/* ---------- DISCOUNT PRICE ---------- */}
      <TextInput
        style={styles.input}
        placeholder="Discount Price (optional)"
        placeholderTextColor="#555"
        keyboardType="numeric"
        value={discountPrice}
        onChangeText={setDiscountPrice}
      />

      {/* ---------- BUTTON ---------- */}
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleAddProduct}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Adding..." : "Add Product"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  datePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  button: {
    backgroundColor: "#521313",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
