import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { signIn } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const GREEN      = '#16a34a';
const GREEN_DARK = '#14532d';
const BG         = '#f0fdf4';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const data = await signIn(email.trim(), password);

      // Persist session + user in AuthContext (AsyncStorage).
      // RootNavigator reads user.role and routes automatically:
      //   role === 'admin'  →  AdminPanel
      //   anything else     →  Main (student tabs)
      await login(data.user);

    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Logo / Brand ── */}
        <View style={styles.brandWrapper}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>CW</Text>
          </View>
          <Text style={styles.brandName}>CHMSU Wear</Text>
          <Text style={styles.brandTagline}>Your campus. Your style.</Text>
        </View>

        {/* ── Card ── */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Welcome Back</Text>
          <Text style={styles.cardSub}>Sign in to your account</Text>

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
            placeholder="••••••••"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.primaryBtnText}>Log In</Text>
            }
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('SignUp')}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryBtnText}>Create an Account</Text>
          </TouchableOpacity>

          {/* ── Demo Account Info ── */}
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Demo Account</Text>
            <Text style={styles.demoRow}>
              <Text style={styles.demoLabel}>Email:    </Text>
              <Text style={styles.demoValue}>anamarielatosa@gmail.com</Text>
            </Text>
            <Text style={styles.demoRow}>
              <Text style={styles.demoLabel}>Password: </Text>
              <Text style={styles.demoValue}>password</Text>
            </Text>
          </View>
        </View>

        <Text style={styles.membersNote}>
          Members: Ana Marie Latosa, Dianne Algreien Tangub, Kirstin Villarin
        </Text>
        <Text style={styles.footer}>© 2025 CHMSU Wear. All rights reserved.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex:               { flex: 1, backgroundColor: BG },
  container:          { flexGrow: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 64, paddingBottom: 32 },

  brandWrapper:       { alignItems: 'center', marginBottom: 32 },
  logoCircle:         {
                        width: 72, height: 72, borderRadius: 36,
                        backgroundColor: GREEN, justifyContent: 'center', alignItems: 'center',
                        marginBottom: 12,
                        shadowColor: GREEN, shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.35, shadowRadius: 10, elevation: 6,
                      },
  logoText:           { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  brandName:          { fontSize: 28, fontWeight: '800', color: GREEN_DARK, letterSpacing: 0.5 },
  brandTagline:       { fontSize: 13, color: '#4ade80', marginTop: 4, fontStyle: 'italic' },

  card:               {
                        width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 28,
                        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
                      },
  cardHeading:        { fontSize: 22, fontWeight: '800', color: GREEN_DARK, marginBottom: 4 },
  cardSub:            { fontSize: 14, color: '#6b7280', marginBottom: 24 },

  label:              { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input:              {
                        borderWidth: 1.5, borderColor: '#d1fae5', borderRadius: 10,
                        paddingHorizontal: 14, paddingVertical: 12,
                        fontSize: 15, color: '#111827', backgroundColor: '#f9fafb', marginBottom: 16,
                      },

  forgotBtn:          { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText:         { fontSize: 13, color: GREEN, fontWeight: '600' },

  primaryBtn:         {
                        backgroundColor: GREEN, borderRadius: 12, paddingVertical: 14,
                        alignItems: 'center',
                        shadowColor: GREEN, shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
                      },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText:     { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },

  dividerRow:         { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine:        { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  dividerLabel:       { marginHorizontal: 12, fontSize: 13, color: '#9ca3af', fontWeight: '500' },

  secondaryBtn:       { borderWidth: 2, borderColor: GREEN, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  secondaryBtnText:   { color: GREEN, fontSize: 16, fontWeight: '700' },

  demoBox:            { marginTop: 20, backgroundColor: '#f0fdf4', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#bbf7d0' },
  demoTitle:          { fontSize: 12, fontWeight: '800', color: GREEN_DARK, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  demoRow:            { fontSize: 13, color: '#374151', marginBottom: 4 },
  demoLabel:          { fontWeight: '700', color: GREEN_DARK },
  demoValue:          { fontWeight: '400', color: '#374151' },

  membersNote:        { marginTop: 8, fontSize: 11, color: '#6b7280', textAlign: 'center', fontStyle: 'italic' },
  footer:             { marginTop: 8, fontSize: 12, color: '#a3a3a3', textAlign: 'center' },
});