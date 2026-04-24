import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // You may need to install this

const SellScreen = () => {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Sell Item</Text>
        
        {/* Image Upload Area */}
        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImg} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={{ fontSize: 40 }}>📸</Text>
              <Text style={styles.placeholderText}>Tap to upload item photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Tip Box (The light blue box in your HTML) */}
        <View style={styles.tipBox}>
          <Text style={styles.tipText}>
            <Text style={{ fontWeight: 'bold' }}>Tip:</Text> Clear photos and fair prices get approved faster by the CHMSU Admin team.
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <Text style={styles.label}>Item Name</Text>
          <TextInput style={styles.input} placeholder="e.g. Engineering Drawing Kit" />

          <Text style={styles.label}>Price (₱)</Text>
          <TextInput style={styles.input} placeholder="0.00" keyboardType="numeric" />

          <TouchableOpacity style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>List Item for Sale</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#064e3b', marginBottom: 20 },
  
  imageUpload: {
    width: '100%',
    height: 200,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  previewImg: { width: '100%', height: '100%' },
  placeholderText: { color: '#64748b', marginTop: 10, fontWeight: '600' },

  tipBox: {
    backgroundColor: '#ecfdf5',
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginTop: 20,
  },
  tipText: { fontSize: 12, color: '#065f46', lineHeight: 18 },

  form: { marginTop: 25 },
  label: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 8 },
  input: {
    backgroundColor: '#f1f5f9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16
  },
  submitBtn: {
    backgroundColor: '#16a34a',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10
  },
  submitBtnText: { color: 'white', fontWeight: '700', fontSize: 16 }
});

export default SellScreen;
