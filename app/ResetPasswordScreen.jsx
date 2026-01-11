import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const { token } = params; // gets token from deep link

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) return Alert.alert('Error', 'Fill all fields');
    if (newPassword !== confirmPassword) return Alert.alert('Error', 'Passwords do not match');

    setLoading(true);
    try {
      const response = await fetch('http://172.20.10.7:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword, confirmPassword })
      });
      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert('Success', 'Password reset successfully!');
        router.replace('/LoginScreen');
      } else {
        Alert.alert('Error', data.msg || 'Failed to reset password');
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'Server error');
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput style={styles.input} placeholder="New Password" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Reset Password</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', padding: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#5C1A18', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
