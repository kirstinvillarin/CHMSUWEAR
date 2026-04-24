import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const PaymentScreen = ({ route, navigation }) => {
  const { total = 0, cartItems = [] } = route?.params ?? {};

  const [paymentMethod, setPaymentMethod] = useState('gcash');
  const [fullName, setFullName]           = useState('');
  const [studentId, setStudentId]         = useState('');

  const handlePlaceOrder = () => {
    if (!fullName.trim()) {
      Alert.alert('Missing Info', 'Please enter your full name.');
      return;
    }
    if (!studentId.trim()) {
      Alert.alert('Missing Info', 'Please enter your Student ID.');
      return;
    }

    Alert.alert(
      'Confirm Order',
      `Place order via ${paymentMethod === 'gcash' ? 'GCash / E-Wallet' : 'Cash on Meetup'} for ₱${total.toLocaleString()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // TODO: send order to your backend here
            Alert.alert(
              'Order Placed! 🎉',
              'Your order has been submitted successfully.',
              [{ text: 'OK', onPress: () => navigation.navigate('Main') }]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ── Header ──────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.btnBack}
            onPress={() => navigation?.goBack()}
          >
            <Text style={styles.btnBackText}>← Return to Cart</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Order Summary Card ───────────────────────────── */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>

            {cartItems.map((item) => (
              <View key={item.id} style={styles.summaryItem}>
                <Text style={styles.summaryItemName}>
                  {item.quantity}x {item.title}
                </Text>
                <Text style={styles.summaryItemPrice}>
                  ₱{(item.price * item.quantity).toLocaleString()}
                </Text>
              </View>
            ))}

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <Text style={styles.summaryMuted}>Subtotal</Text>
              <Text style={styles.summaryMuted}>₱{total.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryMuted}>Service Fee</Text>
              <Text style={styles.summaryMuted}>₱0.00</Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Due</Text>
              <Text style={styles.totalAmount}>₱{total.toLocaleString()}</Text>
            </View>

            {/* Campus policy note */}
            <View style={styles.policyBox}>
              <Text style={styles.policyText}>
                <Text style={{ fontWeight: '800' }}>Campus Policy: </Text>
                Meetups should take place in public campus areas like the Student Lounge. Inspect items before paying.
              </Text>
            </View>
          </View>

          {/* ── Payment Method ───────────────────────────────── */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <Text style={styles.sectionSub}>
              Confirm your order and select how you'd like to pay.
            </Text>

            <TouchableOpacity
              style={[styles.methodOption, paymentMethod === 'gcash' && styles.methodOptionActive]}
              onPress={() => setPaymentMethod('gcash')}
              activeOpacity={0.8}
            >
              <View style={[styles.radioOuter, paymentMethod === 'gcash' && styles.radioOuterActive]}>
                {paymentMethod === 'gcash' && <View style={styles.radioInner} />}
              </View>
              <View style={styles.methodDetails}>
                <Text style={styles.methodName}>GCash / E-Wallet</Text>
                <Text style={styles.methodDesc}>Instant payment via mobile wallet</Text>
              </View>
              <Text style={styles.methodEmoji}>💳</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodOption, paymentMethod === 'meetup' && styles.methodOptionActive]}
              onPress={() => setPaymentMethod('meetup')}
              activeOpacity={0.8}
            >
              <View style={[styles.radioOuter, paymentMethod === 'meetup' && styles.radioOuterActive]}>
                {paymentMethod === 'meetup' && <View style={styles.radioInner} />}
              </View>
              <View style={styles.methodDetails}>
                <Text style={styles.methodName}>Cash on Meetup</Text>
                <Text style={styles.methodDesc}>Pay in person at CHMSU Campus</Text>
              </View>
              <Text style={styles.methodEmoji}>🤝</Text>
            </TouchableOpacity>
          </View>

          {/* ── Verification Info ────────────────────────────── */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Verification Info</Text>

            <TextInput
              style={styles.inputField}
              placeholder="Full Name"
              placeholderTextColor="#94a3b8"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
            <TextInput
              style={[styles.inputField, { marginBottom: 0 }]}
              placeholder="Student ID (e.g., 21-0123)"
              placeholderTextColor="#94a3b8"
              value={studentId}
              onChangeText={setStudentId}
              autoCapitalize="none"
            />
          </View>

          {/* ── Place Order Button ───────────────────────────── */}
          <TouchableOpacity style={styles.btnPay} onPress={handlePlaceOrder}>
            <Text style={styles.btnPayText}>Place Your Order</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { padding: 20, paddingBottom: 48 },

  // Header
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
  btnBack: {
    alignSelf: 'flex-start', backgroundColor: 'white',
    paddingVertical: 10, paddingHorizontal: 16,
    borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0',
  },
  btnBackText: { color: '#064e3b', fontWeight: '700', fontSize: 14 },

  // Order Summary Card (dark green)
  summaryCard: {
    backgroundColor: '#064e3b',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  summaryTitle: {
    color: 'white', fontSize: 18, fontWeight: '800',
    marginBottom: 16, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  summaryItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryItemName: { color: 'rgba(255,255,255,0.9)', fontSize: 14, flex: 1, marginRight: 8 },
  summaryItemPrice: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '700' },
  summaryDivider: {
    height: 1, backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 14,
  },
  summaryMuted: { color: 'rgba(255,255,255,0.65)', fontSize: 14 },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 16, paddingTop: 16,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)',
  },
  totalLabel: { color: 'white', fontSize: 18, fontWeight: '700' },
  totalAmount: { color: 'white', fontSize: 26, fontWeight: '800' },
  policyBox: {
    marginTop: 20, backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 16, borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  policyText: { color: '#d1fae5', fontSize: 12, lineHeight: 18 },

  // Section card (white)
  sectionCard: {
    backgroundColor: 'white', borderRadius: 24, padding: 24,
    marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0',
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#064e3b', marginBottom: 4 },
  sectionSub: { fontSize: 13, color: '#64748b', marginBottom: 20 },

  // Payment method options
  methodOption: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 2, borderColor: '#f1f5f9', borderRadius: 16,
    padding: 18, marginBottom: 12,
  },
  methodOptionActive: { borderColor: '#16a34a', backgroundColor: '#f0fdf4' },
  radioOuter: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: '#cbd5e1',
    alignItems: 'center', justifyContent: 'center',
  },
  radioOuterActive: { borderColor: '#16a34a' },
  radioInner: {
    width: 11, height: 11, borderRadius: 6,
    backgroundColor: '#16a34a',
  },
  methodDetails: { flex: 1 },
  methodName: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 2 },
  methodDesc: { fontSize: 12, color: '#64748b' },
  methodEmoji: { fontSize: 22 },

  // Inputs
  inputField: {
    borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 12,
    padding: 14, fontSize: 14, color: '#1e293b',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    marginBottom: 14, backgroundColor: '#fafafa',
  },

  // Pay button
  btnPay: {
    backgroundColor: '#16a34a', paddingVertical: 18,
    borderRadius: 16, alignItems: 'center', marginTop: 4,
  },
  btnPayText: { color: 'white', fontWeight: '800', fontSize: 16 },
});

export default PaymentScreen;