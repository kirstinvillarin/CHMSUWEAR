// screens/SubScreens/PaymentSystem.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function PaymentSystem() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Payment System</Text>

      <Text style={styles.subtitle}>
        Securely pay for items in the store or marketplace.
      </Text>

      <Button
        title="Proceed to Payment"
        color="#16a34a"
        onPress={() => alert('Payment Placeholder')}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:20, justifyContent:'center', backgroundColor:'#f0fdf4' },

  title:{ fontSize:24, fontWeight:'bold', color:'#14532d', marginBottom:10 },

  subtitle:{ fontSize:16, color:'#6b7280', marginBottom:20 }
});