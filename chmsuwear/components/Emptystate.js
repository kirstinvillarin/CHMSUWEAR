import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * EmptyState — displays a friendly placeholder when a list or tab has no data.
 *
 * Props:
 *  icon    (string)  - emoji or short text icon  (default: '📭')
 *  title   (string)  - bold headline
 *  message (string)  - supporting copy
 */
const EmptyState = ({
  icon = '📭',
  title = 'No data available',
  message = "There's nothing here yet. Check back soon!",
}) => (
  <View style={styles.container}>
    <Text style={styles.icon}>{icon}</Text>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  icon: {
    fontSize: 54,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyState;