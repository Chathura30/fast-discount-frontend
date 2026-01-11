import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import BottomTab from '../components/BottomTab';

export default function OffersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.bigText}>Big <Text style={styles.normalText}>Offers</Text></Text>
      
      <View style={styles.offerCard}>
        <Image source={require('../assets/images/adaptive-icon5.png')} style={styles.offerImage} />
        <View style={styles.offerContent}>
          <Text style={styles.offerTitle}>Get 10% off Your First Order</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Collect</Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomTab />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  bigText: { fontSize: 50, fontWeight: 'bold' },
  normalText: { fontWeight: 'normal' },

  offerCard: {
    backgroundColor: '#144D3C',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerImage: { width: 100, height: 100, resizeMode: 'contain', marginRight: 15 },
  offerContent: { flex: 1 },
  offerTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 10 },

  button: {
    backgroundColor: '#B22222',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
