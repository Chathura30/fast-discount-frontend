import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/adaptive-icon.png')}
        style={[styles.image, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
      />
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
       <Text style={styles.title}>Shop Your{'\n'}Daily <Text style={styles.highlight}>Necessary</Text></Text>
      
      </Animated.Text>
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Shop Now</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#174D38',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 400,
    height: 400,
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  highlight: {
    color: '#00B37E',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#5C1A18',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
