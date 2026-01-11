import React from "react";
import { Stack } from "expo-router";
import SafeScreen from "@/components/SafeScreen";
import { FavoriteProvider } from "../context/FavoriteContext";
import { CartProvider } from "../context/CartContext";

export default function RootLayout() {
  return (
    <FavoriteProvider>
      <CartProvider>
        <SafeScreen>
          <Stack screenOptions={{ headerShown: false }} />
        </SafeScreen>
      </CartProvider>
    </FavoriteProvider>
  );
}
