// screens/SignUpScreen.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator, Alert, Modal,
} from 'react-native';
import { signUp } from '../lib/supabase';

const GREEN      = '#16a34a';
const GREEN_DARK = '#14532d';
const BG         = '#f0fdf4';

const ROLES = [
  {
    id:          'student',
    label:       'Student / User',
    icon:        '🎓',
    description: 'Browse, buy, and sell items within the CHMSU campus community.',
    color:       '#f0fdf4',
    border:      '#bbf7d0',
    textColor:   GREEN_DARK,
    badgeColor:  GREEN,
  },
  {
    id:          'admin',
    label:       'Administrator',
    icon:        '🛡️',
    description: 'Manage listings, verify students, and oversee platform operations.',
    color:       '#eff6ff',
    border:      '#bfdbfe',
    textColor:   '#1e3a5f',
    badgeColor:  '#2563eb',
  },
];

export default function SignUpScreen({ navigation }) {
  const [step, setStep]                       = useState('role'); // 'role' | 'form'
  const [selectedRole, setSelectedRole]       = useState('');
  const [name, setName]                       = useState('');
  const [email, setEmail]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading]                 = useState(false);
  const [showSuccess, setShowSuccess]         = useState(false);

  // ── Step 1: Role Selection ─────────────────────────────────────────────────
  const proceedToForm = () => {
    if (!selectedRole) {
      Alert.alert('Select a Role', 'Please choose Student or Administrator.');
      return;
    }
    setStep('form');
  };

  // ── Step 2: Sign-up Form ───────────────────────────────────────────────────
  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await signUp(email.trim(), password, { fullName: name.trim(), role: selectedRole });
      setShowSuccess(true);
    } catch (error) {
      Alert.alert('Sign Up Failed', error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigation.replace('Login');
  };

  // ── Role Selection Screen ──────────────────────────────────────────────────
  if (step === 'role') {
    return (
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.brandWrapper}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>CW</Text>
            </View>
            <Text style={styles.brandName}>Join CHMSU Wear</Text>
            <Text style={styles.brandTagline}>Who are you signing up as?</Text>
          </View>

          {/* Role Cards */}
          {ROLES.map(role => (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.roleCard,
                { backgroundColor: role.color, borderColor: selectedRole === role.id ? role.badgeColor : role.border },
                selectedRole === role.id && styles.roleCardSelected,
              ]}
              onPress={() => setSelectedRole(role.id)}
              activeOpacity={0.8}
            >
              <View style={styles.roleCardTop}>
                <Text style={styles.roleIcon}>{role.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.roleLabel, { color: role.textColor }]}>{role.label}</Text>
                  <Text style={styles.roleDesc}>{role.description}</Text>
                </View>
                <View style={[styles.radioOuter, { borderColor: selectedRole === role.id ? role.badgeColor : '#d1d5db' }]}>
                  {selectedRole === role.id && (
                    <View style={[styles.radioInner, { backgroundColor: role.badgeColor }]} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.primaryBtn} onPress={proceedToForm} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Continue →</Text>
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>© 2025 CHMSU Wear. All rights reserved.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ── Sign-up Form Screen ────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => setStep('role')} style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.brandWrapper}>
          <View style={[styles.logoCircle, selectedRole === 'admin' && { backgroundColor: '#2563eb' }]}>
            <Text style={styles.logoText}>{selectedRole === 'admin' ? '🛡️' : 'CW'}</Text>
          </View>
          <Text style={styles.brandName}>Create Account</Text>
          <View style={[styles.rolePill, { backgroundColor: selectedRole === 'admin' ? '#dbeafe' : '#dcfce7' }]}>
            <Text style={[styles.rolePillText, { color: selectedRole === 'admin' ? '#1d4ed8' : GREEN_DARK }]}>
              {selectedRole === 'admin' ? '🛡️ Administrator' : '🎓 Student / User'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeading}>Your Details</Text>
          <Text style={styles.cardSub}>Fill in your information below</Text>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Juan dela Cruz"
            placeholderTextColor="#9ca3af"
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="At least 6 characters"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter your password"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <Text style={styles.termsText}>
            By signing up, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>

          <TouchableOpacity
            style={[
              styles.primaryBtn,
              loading && styles.primaryBtnDisabled,
              selectedRole === 'admin' && { backgroundColor: '#2563eb' },
            ]}
            onPress={handleSignUp}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.primaryBtnText}>Create Account</Text>
            }
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.membersNote}>
          Members: Ana Marie Latosa, Dianne Algreien Tangub, Kirstin Villarin
        </Text>
        <Text style={styles.footer}>© 2025 CHMSU Wear. All rights reserved.</Text>
      </ScrollView>

      {/* ── Success Modal ── */}
      <Modal visible={showSuccess} transparent animationType="fade" onRequestClose={handleSuccessClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={[styles.iconCircle, selectedRole === 'admin' && { backgroundColor: '#dbeafe' }]}>
              <Text style={styles.iconEmoji}>{selectedRole === 'admin' ? '🛡️' : '📧'}</Text>
            </View>
            <Text style={styles.modalTitle}>
              {selectedRole === 'admin' ? 'Admin Account Created!' : 'Check Your Email!'}
            </Text>
            <Text style={styles.modalMessage}>
              {selectedRole === 'admin'
                ? `Your administrator account has been created.\n\nYou can now log in and access the Admin Panel.`
                : `We sent a confirmation link to\n`
              }
              {selectedRole !== 'admin' && <Text style={styles.emailHighlight}>{email}</Text>}
              {selectedRole !== 'admin' && `\n\nOpen your Gmail and click the link to confirm your account.`}
            </Text>
            {selectedRole === 'student' && (
              <View style={styles.stepsBox}>
                <Text style={styles.stepItem}>① Open your Gmail inbox</Text>
                <Text style={styles.stepItem}>② Find the email from CHMSU Wear</Text>
                <Text style={styles.stepItem}>③ Click <Text style={styles.stepBold}>"Confirm your email"</Text></Text>
                <Text style={styles.stepItem}>④ Come back and log in</Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.modalBtn, selectedRole === 'admin' && { backgroundColor: '#2563eb' }]}
              onPress={handleSuccessClose}
              activeOpacity={0.85}
            >
              <Text style={styles.modalBtnText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex:              { flex: 1, backgroundColor: BG },
  container:         { flexGrow: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 32 },
  headerRow:         { width: '100%', marginBottom: 8 },
  backBtn:           { width: 40, height: 40, borderRadius: 20, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center' },
  backArrow:         { fontSize: 20, color: GREEN, fontWeight: '700' },
  brandWrapper:      { alignItems: 'center', marginBottom: 28 },
  logoCircle:        { width: 64, height: 64, borderRadius: 32, backgroundColor: GREEN, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  logoText:          { fontSize: 22, fontWeight: '900', color: '#fff' },
  brandName:         { fontSize: 26, fontWeight: '800', color: GREEN_DARK, letterSpacing: 0.5 },
  brandTagline:      { fontSize: 13, color: '#4ade80', marginTop: 4, fontStyle: 'italic' },
  rolePill:          { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginTop: 8 },
  rolePillText:      { fontSize: 13, fontWeight: '800' },
  roleCard:          { width: '100%', borderRadius: 18, borderWidth: 2, padding: 18, marginBottom: 14 },
  roleCardSelected:  { shadowColor: GREEN, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  roleCardTop:       { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  roleIcon:          { fontSize: 32, marginTop: 2 },
  roleLabel:         { fontSize: 17, fontWeight: '800', marginBottom: 4 },
  roleDesc:          { fontSize: 13, color: '#6b7280', lineHeight: 18 },
  radioOuter:        { width: 22, height: 22, borderRadius: 11, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginTop: 4, flexShrink: 0 },
  radioInner:        { width: 12, height: 12, borderRadius: 6 },
  card:              { width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  cardHeading:       { fontSize: 22, fontWeight: '800', color: GREEN_DARK, marginBottom: 4 },
  cardSub:           { fontSize: 14, color: '#6b7280', marginBottom: 24 },
  label:             { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input:             { borderWidth: 1.5, borderColor: '#d1fae5', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#111827', backgroundColor: '#f9fafb', marginBottom: 16 },
  termsText:         { fontSize: 12, color: '#6b7280', marginBottom: 20, lineHeight: 18 },
  termsLink:         { color: GREEN, fontWeight: '600' },
  primaryBtn:        { width: '100%', backgroundColor: GREEN, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  primaryBtnDisabled:{ opacity: 0.6 },
  primaryBtnText:    { color: '#fff', fontSize: 16, fontWeight: '700' },
  loginRow:          { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  loginPrompt:       { fontSize: 14, color: '#6b7280' },
  loginLink:         { fontSize: 14, color: GREEN, fontWeight: '700' },
  membersNote:       { marginTop: 20, fontSize: 11, color: '#6b7280', textAlign: 'center', fontStyle: 'italic' },
  footer:            { marginTop: 8, fontSize: 12, color: '#a3a3a3', textAlign: 'center' },
  modalOverlay:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  modalCard:         { width: '100%', backgroundColor: '#fff', borderRadius: 24, padding: 28, alignItems: 'center' },
  iconCircle:        { width: 80, height: 80, borderRadius: 40, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center', marginBottom: 18 },
  iconEmoji:         { fontSize: 38 },
  modalTitle:        { fontSize: 22, fontWeight: '800', color: GREEN_DARK, marginBottom: 12, textAlign: 'center' },
  modalMessage:      { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  emailHighlight:    { color: GREEN_DARK, fontWeight: '700', fontSize: 14 },
  stepsBox:          { width: '100%', backgroundColor: '#f0fdf4', borderRadius: 12, padding: 16, marginBottom: 24, gap: 8 },
  stepItem:          { fontSize: 13, color: '#374151', lineHeight: 20 },
  stepBold:          { fontWeight: '700', color: GREEN_DARK },
  modalBtn:          { width: '100%', backgroundColor: GREEN, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  modalBtnText:      { color: '#fff', fontSize: 16, fontWeight: '700' },
});