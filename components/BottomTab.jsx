// components/BottomTab.jsx
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BottomTab() {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('role');
        setRole(storedRole);
      } catch (error) {
        console.error('Error loading role:', error);
      } finally {
        setLoading(false);
      }
    };
    getUserRole();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 10,
        }}
      >
        <ActivityIndicator size="small" color="#144D3C" />
      </View>
    );
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#144D3C',
        paddingVertical: 20,
        position: 'absolute',
        bottom: 30,
        borderRadius: 50,
        left: 10,
        right: 10,
      }}
    >
      <TouchableOpacity onPress={() => router.push('/HomeScreen')}>
        <Ionicons name="home" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/FavoritesScreen')}>
        <Ionicons name="heart" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/OffersScreen')}>
        <FontAwesome name="tags" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/CartScreen')}>
        <Ionicons name="cart" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Role-based navigation for Profile */}
      <TouchableOpacity
        onPress={() =>
          router.push(role === 'admin' ? '/AdminDashboard' : '/UserDashboard')
        }
      >
        <Ionicons name="person" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

