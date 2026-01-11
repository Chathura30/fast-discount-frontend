import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTab from '../components/BottomTab';
import { useRouter } from 'expo-router';

const UserDashboard = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.name); // Display real name
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace('/LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{userName}</Text>

      <View style={styles.menu}>
        <MenuButton title="My Orders" onPress={() => router.push('/MyOrders')} />
        <MenuButton title="Account Information" onPress={() => router.push('/AccountInformation')} />
        <MenuButton title="Help" onPress={() => router.push('/HelpPage')} />
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

export default UserDashboard;
