import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AppButton from '../../components/AppButton';
import AppInput from '../../components/AppInput';
import { useAuth } from '../../context/AuthContext';

// ─── Hardcoded fallback account ───────────────────────────────────────────────
const FALLBACK_EMAIL = 'student@school.edu';
const FALLBACK_PASSWORD = 'student123';

// ─── Validation helpers ────────────────────────────────────────────────────────
const validateEmail = (email) => {
  if (!email.trim()) return 'Email is required.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Please enter a valid email address.';
  return '';
};

const validatePassword = (password) => {
  if (!password) return 'Password is required.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  return '';
};

// ─── Component ─────────────────────────────────────────────────────────────────
const StudentAuth = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 1. Validate inputs
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) return;

    // 2. Simulate 2-second network delay
    setLoading(true);
    await new Promise((res) => setTimeout(res, 2000));

    // 3. Check credentials (replace with Supabase call as needed)
    if (
      email.trim().toLowerCase() === FALLBACK_EMAIL &&
      password === FALLBACK_PASSWORD
    ) {
      const userData = {
        id: 'student_001',
        email: FALLBACK_EMAIL,
        name: 'Student User',
        role: 'student',
      };
      await login(userData); // persists session to AsyncStorage
    } else {
      setLoading(false);
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
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
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Sign in to your student account</Text>

        <AppInput
          label="Email"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            if (emailError) setEmailError('');
          }}
          error={emailError}
          placeholder="you@school.edu"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AppInput
          label="Password"
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            if (passwordError) setPasswordError('');
          }}
          error={passwordError}
          placeholder="••••••••"
          secureEntry
        />

        <AppButton
          title="Log In"
          onPress={handleLogin}
          loading={loading}
          style={styles.loginBtn}
        />

        <Text style={styles.hint}>
          Demo credentials:{'\n'}
          {FALLBACK_EMAIL} / {FALLBACK_PASSWORD}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#222',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    marginBottom: 36,
  },
  loginBtn: {
    marginTop: 8,
  },
  hint: {
    marginTop: 32,
    fontSize: 12,
    color: '#bbb',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default StudentAuth;