// screens/SubScreens/Messaging.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function Messaging() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>In-App Messaging</Text>

      <Text style={styles.subtitle}>
        Send messages and receive real-time campus alerts.
      </Text>

      <Button
        title="Open Chat"
        color="#16a34a"
        onPress={() => alert('Messaging Placeholder')}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:20, justifyContent:'center', backgroundColor:'#f0fdf4' },

  title:{ fontSize:24, fontWeight:'bold', color:'#14532d', marginBottom:10 },

  subtitle:{ fontSize:16, color:'#6b7280', marginBottom:20 }
});