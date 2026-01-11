import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTab from '../components/BottomTab';
import { useRouter } from 'expo-router';

const AdminDashboard = () => {
  const router = useRouter();

  const handleLogout = async () => {
    
    await AsyncStorage.clear();

    
    router.replace('/LoginScreen'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>Admin</Text>

      <View style={styles.menu}>
        <MenuButton title="All Orders" onPress={() => router.push('/AllOrders')} />
        <MenuButton title="Add New Product" onPress={() => router.push('/AddProductScreen')} />
        <MenuButton title="Sales Report" onPress={() => router.push('/SalesScreen')} />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <BottomTab />
    </View>
  );
};

const MenuButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.menuButton} onPress={onPress}>
    <Text style={styles.menuText}>{title}</Text>
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: '#EDEDED', paddingTop: 50 },
  name: { fontSize: 20, fontWeight: '600', marginBottom: 20 },
  menu: { width: '90%' },
  menuButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  menuText: { fontSize: 16, color: '#000' },
  arrow: { fontSize: 18, color: '#000' },
  logoutButton: {
    backgroundColor: '#5C1A18',
    width: '90%',
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 20,
  },
  logoutText: { color: '#FFF', textAlign: 'center', fontSize: 16 },
});

export default AdminDashboard;
