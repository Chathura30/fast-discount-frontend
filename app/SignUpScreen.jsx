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
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const roleOptions = [
  { label: 'User', value: 'user' },
  { label: 'Admin', value: 'admin' },
];

const SignUpScreen = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Validation error states
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [roleError, setRoleError] = useState('');

  // Validation functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;
  
  // Real-time validation handlers
  const handleUsernameChange = (text) => {
    setUsername(text);
    if (!text.trim()) {
      setUsernameError('Username is required');
    } else if (text.trim().length < 3) {
      setUsernameError('Username must be at least 3 characters');
    } else if (!/^[a-zA-Z0-9_\s]+$/.test(text)) {
      setUsernameError('Username can only contain letters, numbers, and underscores');
    } else {
      setUsernameError('');
    }
  };
  
  const handleEmailChange = (text) => {
    setEmail(text);
    if (!text.trim()) {
      setEmailError('Email is required');
    } else if (!validateEmail(text)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };
  
  const handlePasswordChange = (text) => {
    setPassword(text);
    if (!text) {
      setPasswordError('Password is required');
    } else if (text.length < 6) {
      setPasswordError('Password must be at least 6 characters');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(text)) {
      setPasswordError('Password must contain uppercase and lowercase letters');
    } else {
      setPasswordError('');
    }
    
    // Also validate confirm password if it's filled
    if (confirmPassword && text !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else if (confirmPassword) {
      setConfirmPasswordError('');
    }
  };
  
  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (!text) {
      setConfirmPasswordError('Please confirm your password');
    } else if (text !== password) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSignUp = async () => {
    // Reset errors
    let hasError = false;
    
    // Username validation
    if (!username.trim()) {
      setUsernameError('Username is required');
      hasError = true;
    } else if (username.trim().length < 3) {
      setUsernameError('Username must be at least 3 characters');
      hasError = true;
    } else if (!/^[a-zA-Z0-9_\s]+$/.test(username)) {
      setUsernameError('Username can only contain letters, numbers, and underscores');
      hasError = true;
    } else {
      setUsernameError('');
    }
    
    // Email validation
    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      hasError = true;
    } else {
      setEmailError('');
    }
    
    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      setPasswordError('Password must contain uppercase and lowercase letters');
      hasError = true;
    } else {
      setPasswordError('');
    }
    
    // Confirm password validation
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    } else {
      setConfirmPasswordError('');
    }
    
    // Role validation
    if (!role) {
      setRoleError('Please select a role');
      hasError = true;
    } else {
      setRoleError('');
    }
    
    if (hasError) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://172.20.10.7:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: username,
          email,
          password,
          confirmPassword,
          role,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => router.push('/LoginScreen') },
        ]);
      } else {
        Alert.alert('Sign Up Failed', data.message || 'Something went wrong.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Unable to connect to the server.');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#EDEDED' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Top Half Circle */}
        <View style={styles.halfCircle}>
          <Text style={styles.header}>Sign Up</Text>
        </View>

        <View style={styles.formContainer}>
          <View
            style={[
              styles.inputContainer,
              focusedInput === 'username' && styles.inputFocused,
              usernameError && styles.inputError
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="User Name"
              autoCapitalize="words"
              placeholderTextColor="#999"
              value={username}
              onChangeText={handleUsernameChange}
              onFocus={() => setFocusedInput('username')}
              onBlur={() => setFocusedInput('')}
            />
          </View>
          {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}

          <View
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
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <View
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
                <Text style={{ fontSize: 20 }}>{showPassword ? '👁️' : '🙈'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <View
            style={[
              styles.inputContainer,
              focusedInput === 'confirmPassword' && styles.inputFocused,
              confirmPasswordError && styles.inputError
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Confirm Password"
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                onFocus={() => setFocusedInput('confirmPassword')}
                onBlur={() => setFocusedInput('')}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={{ paddingRight: 12 }}>
                <Text style={{ fontSize: 20 }}>{showConfirmPassword ? '👁️' : '🙈'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

          {/* Dropdown */}
          <Dropdown
            style={[
              styles.dropdown, 
              isFocus && { borderColor: '#174D38' },
              roleError && styles.inputError
            ]}
            data={roleOptions}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Select Role...' : '...'}
            value={role}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setRole(item.value);
              setRoleError('');
              setIsFocus(false);
            }}
          />
          {roleError ? <Text style={styles.errorText}>{roleError}</Text> : null}

          <TouchableOpacity
            style={styles.button}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.footer}>
            Already have an account?{' '}
            <Text style={styles.link} onPress={() => router.push('/LoginScreen')}>
              Sign In
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

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
  header: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  inputContainer: {
    width: '85%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
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
    width: '85%',
    marginLeft: 0,
    fontWeight: '500',
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    backgroundColor: '#F5F5F5',
    width: '85%',
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    justifyContent: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  button: {
    backgroundColor: '#5C1A18',
    paddingVertical: 15,
    paddingHorizontal: 120,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
  },
  link: {
    fontWeight: 'bold',
    color: '#5C1A18',
  },
});
