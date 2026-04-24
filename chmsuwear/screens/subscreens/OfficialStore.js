// screens/SubScreens/OfficialStore.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function OfficialStore() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Official Apparel Store</Text>

      <Text style={styles.subtitle}>
        Browse and purchase official CHMSU merchandise.
      </Text>

      <Button
        title="Shop Now"
        color="#16a34a"
        onPress={() => alert('Shop Placeholder')}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:20, justifyContent:'center', backgroundColor:'#f0fdf4' },

  title:{ fontSize:24, fontWeight:'bold', color:'#14532d', marginBottom:10 },

  subtitle:{ fontSize:16, color:'#6b7280', marginBottom:20 }
});