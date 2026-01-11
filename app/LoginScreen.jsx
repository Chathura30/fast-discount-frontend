import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const API_BASE = "http://172.20.10.7:5000";

const LoginScreen = () => {
  const router = useRouter();

  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation error states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Forgot password modal states
  const [forgotVisible, setForgotVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Email validation
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  // Real-time validation handlers
  const handleEmailChange = (text) => {
    setEmail(text);
    if (text && !validateEmail(text)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };
  
  const handlePasswordChange = (text) => {
    setPassword(text);
    if (text && text.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }
  };

  
  // LOGIN
  
  const handleLogin = async () => {
    // Reset errors
    let hasError = false;
    
    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      hasError = true;
    } else {
      setEmailError('');
    }
    
    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    } else {
      setPasswordError('');
    }
    
    if (hasError) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        const { token, user } = data;
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('role', user.role);
        await AsyncStorage.setItem('name', user.name);

        Alert.alert('Success', 'Login successful!');
        router.replace('/HomeScreen');
      } else {
        Alert.alert('Login Failed', data.msg || 'Invalid credentials.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Unable to connect to the server.');
      console.error(error);
    }
  };

  
// HANDLE FORGOT PASSWORD
  
  const handleForgotPassword = async () => {
    if (!validateEmail(forgotEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setForgotLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();
      setForgotLoading(false);

      if (response.ok) {
        Alert.alert("Success", "Password reset instructions sent to your email.");
        setForgotVisible(false);
        setForgotEmail('');
      } else {
        Alert.alert("Error", data.msg || "Failed to send reset email.");
      }
    } catch (error) {
      setForgotLoading(false);
      Alert.alert("Error", "Unable to connect to the server.");
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#EDEDED' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>


          <View style={styles.halfCircle}>
            <Text style={styles.welcome}>Welcome</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>

            {/* Email Field */}
            <Animated.View
              style={[
                styles.inputContainer, 
                focusedInput === 'email' && styles.inputFocused,
                emailError && styles.inputError
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
                value={email}
                onChangeText={handleEmailChange}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput('')}
              />
            </Animated.View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            {/* Password Field */}
            <Animated.View
              style={[
                styles.inputContainer, 
                focusedInput === 'password' && styles.inputFocused,
                passwordError && styles.inputError
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={handlePasswordChange}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput('')}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ paddingRight: 12 }}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            {/* Forgot Password */}
            <Text style={styles.forgot} onPress={() => setForgotVisible(true)}>
              Forgot Password?
            </Text>

            {/* Login Button  */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginText}>Log In</Text>
              )}
            </TouchableOpacity>

            {/* Sign Up */}
            <Text style={styles.signupText}>
              Don’t have an account?{' '}
              <Text style={styles.link} onPress={() => router.push('/SignUpScreen')}>
                Sign Up
              </Text>
            </Text>
          </View>

          
{/* FORGOT PASSWORD MODAL */}
          
          <Modal
            animationType="slide"
            transparent={true}
            visible={forgotVisible}
            onRequestClose={() => setForgotVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Reset Password</Text>
                <Text style={styles.modalSubtitle}>
                  Enter your email to receive reset instructions.
                </Text>

                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter Email"
                  value={forgotEmail}
                  placeholderTextColor="#aaa"
                  onChangeText={setForgotEmail}
                  keyboardType="email-address"
                />

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleForgotPassword}
                  disabled={forgotLoading}
                >
                  {forgotLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.modalButtonText}>Send Reset Link</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setForgotVisible(false)}>
                  <Text style={styles.modalCancel}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;


const styles = StyleSheet.create({
  halfCircle: {
    width: width,
    height: width / 2,
    backgroundColor: '#174D38',
    borderBottomLeftRadius: width / 2,
    borderBottomRightRadius: width / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
  },
  welcome: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
  },
  inputContainer: {
    width: '85%',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  inputFocused: {
    borderColor: '#174D38',
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#d32f2f',
    backgroundColor: '#fff5f5',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: -5,
    marginBottom: 5,
    marginLeft: 30,
    fontWeight: '500',
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  forgot: {
    alignSelf: 'flex-end',
    marginRight: 30,
    marginTop: 5,
    marginBottom: 30,
    color: '#174D38',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#5C1A18',
    paddingVertical: 15,
    paddingHorizontal: 120,
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    elevation: 5,
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  signupText: {
    fontSize: 14,
    color: '#333',
  },
  link: {
    fontWeight: 'bold',
    color: '#5C1A18',
  },
  
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
    color: '#174D38',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#5C1A18',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginBottom: 15,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalCancel: {
    color: '#174D38',
    fontWeight: '600',
    fontSize: 15,
  },
});
