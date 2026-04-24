// components/MenuCard.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';

export default function MenuCard({ title, subtitle, image, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.row}>

        {image && (
          <Image source={image} style={styles.icon} />
        )}

        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#dcfce7'
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  icon: {
    width: 50,
    height: 50,
    marginRight: 15
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#14532d'
  },

  subtitle: {
    fontSize: 14,
    color: '#6b7280'
  }

});