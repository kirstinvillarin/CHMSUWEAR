// screens/SettingsScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Image,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';

// ─── Theme Tokens ────────────────────────────────────────────────────────────
const LIGHT = {
  bg:           '#f8fafc',
  card:         '#ffffff',
  cardBorder:   '#f1f5f9',
  profileBg:    '#f0fdf4',
  profileBorder:'#dcfce7',
  iconBox:      '#f8fafc',
  iconBorder:   '#e2e8f0',
  labelColor:   '#1e293b',
  descColor:    '#64748b',
  groupColor:   '#94a3b8',
  nameColor:    '#064e3b',
  arrowColor:   '#cbd5e1',
  inputBg:      '#f9fafb',
  inputBorder:  '#d1fae5',
  inputText:    '#111827',
  modalBg:      '#ffffff',
  cancelBg:     '#f1f5f9',
  cancelText:   '#475569',
  logoutBg:     '#fff1f2',
  logoutBorder: '#ffe4e6',
  logoutText:   '#e11d48',
  footerText:   '#94a3b8',
  statusBar:    'dark-content',
  sectionBg:    '#f8fafc',
  dangerText:   '#dc2626',
  successText:  '#16a34a',
  tipBg:        '#f0fdf4',
  tipBorder:    '#bbf7d0',
};

const DARK = {
  bg:           '#0f172a',
  card:         '#1e293b',
  cardBorder:   '#334155',
  profileBg:    '#052e16',
  profileBorder:'#065f46',
  iconBox:      '#0f172a',
  iconBorder:   '#334155',
  labelColor:   '#f1f5f9',
  descColor:    '#94a3b8',
  groupColor:   '#475569',
  nameColor:    '#6ee7b7',
  arrowColor:   '#475569',
  inputBg:      '#0f172a',
  inputBorder:  '#334155',
  inputText:    '#f1f5f9',
  modalBg:      '#1e293b',
  cancelBg:     '#334155',
  cancelText:   '#94a3b8',
  logoutBg:     '#1e0a0a',
  logoutBorder: '#3b1520',
  logoutText:   '#f87171',
  footerText:   '#475569',
  statusBar:    'light-content',
  sectionBg:    '#0f172a',
  dangerText:   '#f87171',
  successText:  '#4ade80',
  tipBg:        '#052e16',
  tipBorder:    '#065f46',
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SettingsScreen({ navigation }) {
  const [isDarkMode, setIsDarkMode]     = useState(false);
  const [user, setUser]                 = useState(null);
  const [profile, setProfile]           = useState({
    name:      '',
    email:     '',
    avatarUrl: null,
  });
  const [editModal, setEditModal]             = useState(false);
  const [passwordModal, setPasswordModal]     = useState(false);
  const [notifModal, setNotifModal]           = useState(false);
  const [safetyModal, setSafetyModal]         = useState(false);

  const [editName, setEditName]         = useState('');
  const [editEmail, setEditEmail]       = useState('');
  const [editAvatar, setEditAvatar]     = useState(null);
  const [saving, setSaving]             = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // ── Password modal state ───────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword]   = useState('');
  const [newPassword, setNewPassword]           = useState('');
  const [confirmPassword, setConfirmPassword]   = useState('');
  const [showCurrent, setShowCurrent]           = useState(false);
  const [showNew, setShowNew]                   = useState(false);
  const [showConfirm, setShowConfirm]           = useState(false);
  const [savingPassword, setSavingPassword]     = useState(false);

  // ── Notification settings state ────────────────────────────────────────────
  const [notifSettings, setNotifSettings] = useState({
    orderUpdates:    true,
    newMessages:     true,
    priceAlerts:     false,
    promotions:      false,
    meetupReminders: true,
    emailDigest:     false,
  });

  const T = isDarkMode ? DARK : LIGHT;

  // ── Fetch logged-in user and profile ──────────────────────────────────────
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { navigation.replace('Login'); return; }
      setUser(authUser);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', authUser.id)
        .single();

      const name =
        profileData?.full_name ||
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        authUser.email?.split('@')[0] ||
        'Student';

      const avatarUrl =
        profileData?.avatar_url ||
        authUser.user_metadata?.avatar_url ||
        null;

      setProfile({ name, email: authUser.email, avatarUrl });
      setLoadingProfile(false);
    };

    fetchUser();
  }, [navigation]);

  const getInitials = useCallback((name = '') => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }, []);

  const openEdit = () => {
    setEditName(profile.name);
    setEditEmail(profile.email);
    setEditAvatar(null);
    setEditModal(true);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera roll access is needed to upload a photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setEditAvatar(result.assets[0].uri);
  };

  const saveProfile = async () => {
    if (!editName.trim()) { Alert.alert('Name cannot be empty.'); return; }
    setSaving(true);
    try {
      let newAvatarUrl = profile.avatarUrl;

      if (editAvatar) {
        const ext      = editAvatar.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${ext}`;
        const response = await fetch(editAvatar);
        const blob     = await response.blob();

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, blob, { upsert: true, contentType: `image/${ext}` });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        newAvatarUrl = urlData.publicUrl;
      }

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id:         user.id,
          full_name:  editName.trim(),
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString(),
        });
      if (upsertError) throw upsertError;

      await supabase.auth.updateUser({
        data: { full_name: editName.trim(), avatar_url: newAvatarUrl },
      });

      setProfile({ name: editName.trim(), email: editEmail.trim() || profile.email, avatarUrl: newAvatarUrl });
      setEditModal(false);
      Alert.alert('Saved', 'Your profile has been updated.');
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  };

  // ── Change Password ────────────────────────────────────────────────────────
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('All fields are required.'); return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Password must be at least 8 characters.'); return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('New passwords do not match.'); return;
    }
    setSavingPassword(true);
    try {
      // Re-authenticate with current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: currentPassword,
      });
      if (signInError) throw new Error('Current password is incorrect.');

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;

      Alert.alert('Success', 'Your password has been changed.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordModal(false);
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  // ── Save notification settings ─────────────────────────────────────────────
  const saveNotifications = async () => {
    try {
      await supabase
        .from('profiles')
        .upsert({ id: user.id, notification_settings: notifSettings, updated_at: new Date().toISOString() });
      Alert.alert('Saved', 'Notification preferences updated.');
      setNotifModal(false);
    } catch {
      // Silently close even if the column doesn't exist yet
      setNotifModal(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          navigation.replace('Login');
        },
      },
    ]);
  };

  if (loadingProfile) {
    return (
      <SafeAreaView style={[styles.flex, { backgroundColor: T.bg, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#16a34a" />
      </SafeAreaView>
    );
  }

  const AvatarDisplay = ({ size = 70, uri = profile.avatarUrl, name = profile.name, radius = 20 }) => (
    uri
      ? <Image source={{ uri }} style={{ width: size, height: size, borderRadius: radius }} />
      : (
        <View style={{ width: size, height: size, borderRadius: radius, backgroundColor: '#16a34a', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: size * 0.32, fontWeight: '800' }}>{getInitials(name)}</Text>
        </View>
      )
  );

  const SettingsItem = ({ icon, label, description, hasArrow, hasSwitch, value, onValueChange, onPress }) => (
    <TouchableOpacity
      style={[styles.settingsItem, { backgroundColor: T.card, borderColor: T.cardBorder }]}
      disabled={hasSwitch && !onPress}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.iconBox, { backgroundColor: T.iconBox, borderColor: T.iconBorder }]}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.settingsLabel, { color: T.labelColor }]}>{label}</Text>
          <Text style={[styles.settingsDesc,  { color: T.descColor  }]}>{description}</Text>
        </View>
      </View>
      {hasArrow  && <Text style={[styles.arrowIcon, { color: T.arrowColor }]}>→</Text>}
      {hasSwitch && (
        <Switch
          trackColor={{ false: '#e2e8f0', true: '#16a34a' }}
          thumbColor="#fff"
          ios_backgroundColor="#e2e8f0"
          onValueChange={onValueChange}
          value={value}
        />
      )}
    </TouchableOpacity>
  );

  // ── Password strength indicator ────────────────────────────────────────────
  const getPasswordStrength = (pass) => {
    if (!pass) return { label: '', color: 'transparent', width: '0%' };
    if (pass.length < 6) return { label: 'Weak', color: '#ef4444', width: '25%' };
    if (pass.length < 10) return { label: 'Fair', color: '#f59e0b', width: '50%' };
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) return { label: 'Strong', color: '#16a34a', width: '100%' };
    return { label: 'Good', color: '#3b82f6', width: '75%' };
  };
  const strength = getPasswordStrength(newPassword);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: T.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: T.profileBg, borderColor: T.profileBorder }]}>
          <View style={styles.avatarContainer}>
            <AvatarDisplay />
            <TouchableOpacity style={[styles.editAvatarBtn, { backgroundColor: T.card, borderColor: T.iconBorder }]} onPress={openEdit}>
              <Text style={{ fontSize: 12 }}>📸</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName,  { color: T.nameColor  }]}>{profile.name}</Text>
            <Text style={[styles.profileEmail, { color: T.descColor  }]}>{profile.email}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>IT STUDENT</Text>
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={[styles.groupTitle, { color: T.groupColor }]}>Preferences</Text>
          <SettingsItem
            icon="👤"
            label="Account Details"
            description="Update name and profile photo"
            hasArrow
            onPress={openEdit}
          />
          <SettingsItem
            icon="🌙"
            label="Dark Mode"
            description="Easier on the eyes for night use"
            hasSwitch
            value={isDarkMode}
            onValueChange={() => setIsDarkMode(prev => !prev)}
          />
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={[styles.groupTitle, { color: T.groupColor }]}>Security</Text>
          <SettingsItem
            icon="🔒"
            label="Password & Security"
            description="Change password and sessions"
            hasArrow
            onPress={() => setPasswordModal(true)}
          />
          <SettingsItem
            icon="🔔"
            label="Notifications"
            description="Configure order and updates"
            hasArrow
            onPress={() => setNotifModal(true)}
          />
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={[styles.groupTitle, { color: T.groupColor }]}>Support & Info</Text>
          <SettingsItem
            icon="🛡️"
            label="Buyer & Seller Safety"
            description="Meetup tips and campus guidelines"
            hasArrow
            onPress={() => setSafetyModal(true)}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: T.logoutBg, borderColor: T.logoutBorder }]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={[styles.logoutText, { color: T.logoutText }]}>Log Out Account</Text>
        </TouchableOpacity>

        <Text style={[styles.footerText, { color: T.footerText }]}>
          CHMSU Wear v1.2.0 • Created by LTV GALS
        </Text>
      </ScrollView>

      {/* ── Edit Profile Modal ──────────────────────────────────────────────── */}
      <Modal visible={editModal} animationType="slide" transparent onRequestClose={() => setEditModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: T.modalBg }]}>
            <Text style={[styles.modalTitle, { color: T.labelColor }]}>Edit Profile</Text>
            <TouchableOpacity onPress={pickImage} style={styles.modalAvatarWrap}>
              {editAvatar
                ? <Image source={{ uri: editAvatar }} style={styles.modalAvatar} />
                : <AvatarDisplay size={80} radius={22} />
              }
              <View style={styles.cameraOverlay}>
                <Text style={{ fontSize: 18 }}>📸</Text>
              </View>
            </TouchableOpacity>
            <Text style={[styles.uploadHint, { color: T.descColor }]}>Tap photo to change picture</Text>
            <Text style={[styles.fieldLabel, { color: T.groupColor }]}>FULL NAME</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: T.inputBg, borderColor: T.inputBorder, color: T.inputText }]}
              value={editName}
              onChangeText={setEditName}
              placeholder="Your full name"
              placeholderTextColor="#9ca3af"
            />
            <Text style={[styles.fieldLabel, { color: T.groupColor }]}>EMAIL</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: T.inputBg, borderColor: T.inputBorder, color: T.descColor, opacity: 0.7 }]}
              value={editEmail}
              editable={false}
              placeholder="email"
              placeholderTextColor="#9ca3af"
            />
            <Text style={{ fontSize: 10, color: T.descColor, marginBottom: 16 }}>
              Email changes require re-verification and are managed separately.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: T.cancelBg }]} onPress={() => setEditModal(false)} disabled={saving}>
                <Text style={[styles.cancelText, { color: T.cancelText }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={saveProfile} disabled={saving}>
                {saving
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={styles.saveText}>Save Changes</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Password & Security Modal ───────────────────────────────────────── */}
      <Modal visible={passwordModal} animationType="slide" transparent onRequestClose={() => setPasswordModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: T.modalBg }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalTitle, { color: T.labelColor }]}>🔒 Password & Security</Text>
              </View>

              {/* Session info */}
              <View style={[styles.infoCard, { backgroundColor: T.tipBg, borderColor: T.tipBorder }]}>
                <Text style={[styles.infoCardTitle, { color: T.successText }]}>✅ Account Secured</Text>
                <Text style={[styles.infoCardBody, { color: T.descColor }]}>
                  Signed in as {profile.email}
                </Text>
                <Text style={[styles.infoCardBody, { color: T.descColor }]}>
                  Last login: {new Date().toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}
                </Text>
              </View>

              <Text style={[styles.fieldLabel, { color: T.groupColor, marginTop: 8 }]}>CHANGE PASSWORD</Text>

              {/* Current password */}
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.modalInput, styles.passwordInput, { backgroundColor: T.inputBg, borderColor: T.inputBorder, color: T.inputText }]}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Current password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showCurrent}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowCurrent(p => !p)}>
                  <Text style={{ fontSize: 18 }}>{showCurrent ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>

              {/* New password */}
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.modalInput, styles.passwordInput, { backgroundColor: T.inputBg, borderColor: T.inputBorder, color: T.inputText }]}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="New password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showNew}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowNew(p => !p)}>
                  <Text style={{ fontSize: 18 }}>{showNew ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>

              {/* Strength bar */}
              {newPassword.length > 0 && (
                <View style={{ marginBottom: 12, marginTop: -8 }}>
                  <View style={[styles.strengthBarBg, { backgroundColor: T.cardBorder }]}>
                    <View style={[styles.strengthBarFill, { width: strength.width, backgroundColor: strength.color }]} />
                  </View>
                  <Text style={{ fontSize: 11, color: strength.color, marginTop: 3, fontWeight: '700' }}>
                    {strength.label} password
                  </Text>
                </View>
              )}

              {/* Confirm password */}
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.modalInput, styles.passwordInput, { backgroundColor: T.inputBg, borderColor: T.inputBorder, color: T.inputText }]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showConfirm}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirm(p => !p)}>
                  <Text style={{ fontSize: 18 }}>{showConfirm ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>

              {/* Match indicator */}
              {confirmPassword.length > 0 && (
                <Text style={{ fontSize: 11, marginBottom: 12, marginTop: -8, fontWeight: '700',
                  color: newPassword === confirmPassword ? T.successText : T.dangerText }}>
                  {newPassword === confirmPassword ? '✅ Passwords match' : '❌ Passwords do not match'}
                </Text>
              )}

              {/* Password tips */}
              <View style={[styles.infoCard, { backgroundColor: T.sectionBg, borderColor: T.cardBorder }]}>
                <Text style={[styles.infoCardTitle, { color: T.labelColor }]}>Password Tips</Text>
                {['At least 8 characters long', 'Include uppercase and numbers', 'Avoid using your name or birthday', 'Never share your password with anyone'].map((tip, i) => (
                  <Text key={i} style={[styles.infoCardBody, { color: T.descColor }]}>• {tip}</Text>
                ))}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: T.cancelBg }]} onPress={() => setPasswordModal(false)} disabled={savingPassword}>
                  <Text style={[styles.cancelText, { color: T.cancelText }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.saveBtn, savingPassword && { opacity: 0.6 }]} onPress={handleChangePassword} disabled={savingPassword}>
                  {savingPassword
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={styles.saveText}>Update Password</Text>
                  }
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Notifications Modal ─────────────────────────────────────────────── */}
      <Modal visible={notifModal} animationType="slide" transparent onRequestClose={() => setNotifModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: T.modalBg }]}>
            <Text style={[styles.modalTitle, { color: T.labelColor }]}>🔔 Notifications</Text>

            {[
              { key: 'orderUpdates',    icon: '📦', label: 'Order Updates',       desc: 'Status changes on your orders' },
              { key: 'newMessages',     icon: '💬', label: 'New Messages',        desc: 'Chat messages from buyers/sellers' },
              { key: 'priceAlerts',     icon: '💰', label: 'Price Alerts',        desc: 'When a watchlisted item drops in price' },
              { key: 'promotions',      icon: '🎉', label: 'Promotions',          desc: 'Campus sale events and featured items' },
              { key: 'meetupReminders', icon: '📍', label: 'Meetup Reminders',    desc: 'Scheduled meetup alerts' },
              { key: 'emailDigest',     icon: '📧', label: 'Email Digest',        desc: 'Weekly summary sent to your email' },
            ].map(({ key, icon, label, desc }) => (
              <View key={key} style={[styles.notifRow, { borderColor: T.cardBorder }]}>
                <View style={styles.itemLeft}>
                  <View style={[styles.iconBox, { backgroundColor: T.iconBox, borderColor: T.iconBorder }]}>
                    <Text style={styles.iconText}>{icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.settingsLabel, { color: T.labelColor }]}>{label}</Text>
                    <Text style={[styles.settingsDesc,  { color: T.descColor  }]}>{desc}</Text>
                  </View>
                </View>
                <Switch
                  trackColor={{ false: '#e2e8f0', true: '#16a34a' }}
                  thumbColor="#fff"
                  ios_backgroundColor="#e2e8f0"
                  value={notifSettings[key]}
                  onValueChange={(val) => setNotifSettings(prev => ({ ...prev, [key]: val }))}
                />
              </View>
            ))}

            <View style={[styles.modalActions, { marginTop: 16 }]}>
              <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: T.cancelBg }]} onPress={() => setNotifModal(false)}>
                <Text style={[styles.cancelText, { color: T.cancelText }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveNotifications}>
                <Text style={styles.saveText}>Save Preferences</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Buyer & Seller Safety Modal ─────────────────────────────────────── */}
      <Modal visible={safetyModal} animationType="slide" transparent onRequestClose={() => setSafetyModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: T.modalBg, paddingBottom: Platform.OS === 'ios' ? 40 : 28 }]}>
            <Text style={[styles.modalTitle, { color: T.labelColor }]}>🛡️ Buyer & Seller Safety</Text>
            <ScrollView showsVerticalScrollIndicator={false}>

              {/* Meetup guidelines */}
              <View style={[styles.safetySection, { backgroundColor: T.tipBg, borderColor: T.tipBorder }]}>
                <Text style={[styles.safetySectionTitle, { color: T.successText }]}>📍 Safe Meetup Guidelines</Text>
                {[
                  'Meet only inside CHMSU campus grounds',
                  'Choose busy, well-lit areas like the library or canteen',
                  'Bring a classmate or friend as a companion',
                  'Conduct meetups during school hours (7AM–6PM)',
                  'Inform someone you trust about your meetup details',
                ].map((tip, i) => (
                  <Text key={i} style={[styles.safetyItem, { color: T.labelColor }]}>✔ {tip}</Text>
                ))}
              </View>

              {/* Buyer tips */}
              <View style={[styles.safetySection, { backgroundColor: T.sectionBg, borderColor: T.cardBorder }]}>
                <Text style={[styles.safetySectionTitle, { color: T.labelColor }]}>🛒 Tips for Buyers</Text>
                {[
                  'Inspect the item thoroughly before paying',
                  'Only pay in person — avoid advance payments',
                  'Verify the item matches the listing photos',
                  'Check for defects or missing parts upfront',
                  'Keep a record of your transaction in the app',
                ].map((tip, i) => (
                  <Text key={i} style={[styles.safetyItem, { color: T.descColor }]}>• {tip}</Text>
                ))}
              </View>

              {/* Seller tips */}
              <View style={[styles.safetySection, { backgroundColor: T.sectionBg, borderColor: T.cardBorder }]}>
                <Text style={[styles.safetySectionTitle, { color: T.labelColor }]}>🏷️ Tips for Sellers</Text>
                {[
                  'Be honest and accurate in your item descriptions',
                  'Upload clear, real photos of your actual item',
                  'Set a fair and reasonable price',
                  'Confirm meetup details before the transaction',
                  'Mark items as sold promptly after a transaction',
                ].map((tip, i) => (
                  <Text key={i} style={[styles.safetyItem, { color: T.descColor }]}>• {tip}</Text>
                ))}
              </View>

              {/* Red flags */}
              <View style={[styles.safetySection, { backgroundColor: '#fff1f2', borderColor: '#fecdd3' }]}>
                <Text style={[styles.safetySectionTitle, { color: '#be123c' }]}>🚨 Red Flags to Watch Out For</Text>
                {[
                  'Asking for payment before the meetup',
                  'Refusing to meet on campus or in public',
                  'Pressure to rush or decide immediately',
                  'Prices that seem too good to be true',
                  'Unverified or new accounts with no history',
                ].map((flag, i) => (
                  <Text key={i} style={[styles.safetyItem, { color: '#be123c' }]}>⚠ {flag}</Text>
                ))}
              </View>

              {/* Report */}
              <View style={[styles.safetySection, { backgroundColor: T.tipBg, borderColor: T.tipBorder }]}>
                <Text style={[styles.safetySectionTitle, { color: T.successText }]}>📢 Report an Incident</Text>
                <Text style={[styles.safetyItem, { color: T.descColor }]}>
                  If you experience or witness suspicious behavior, report it immediately to the CHMSU Student Affairs Office or contact your college administrator.
                </Text>
              </View>

            </ScrollView>

            <TouchableOpacity
              style={[styles.saveBtn, { marginTop: 16 }]}
              onPress={() => setSafetyModal(false)}
            >
              <Text style={styles.saveText}>Got it, stay safe!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },

  profileHeader: {
    flexDirection: 'row', alignItems: 'center',
    padding: 20, borderRadius: 24, borderWidth: 1, marginBottom: 30,
  },
  avatarContainer: { position: 'relative' },
  editAvatarBtn: {
    position: 'absolute', bottom: -5, right: -5,
    width: 28, height: 28, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1,
  },
  profileInfo: { marginLeft: 20, flex: 1 },
  profileName:  { fontSize: 20, fontWeight: '800', marginBottom: 2 },
  profileEmail: { fontSize: 13, marginBottom: 6 },
  badge: { backgroundColor: '#16a34a', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: '800' },

  section: { marginBottom: 25 },
  groupTitle: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12, marginLeft: 5 },

  settingsItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14, borderRadius: 16, marginBottom: 8, borderWidth: 1,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15, borderWidth: 1 },
  iconText: { fontSize: 18 },
  settingsLabel: { fontSize: 15, fontWeight: '700' },
  settingsDesc:  { fontSize: 12, marginTop: 2 },
  arrowIcon: { fontSize: 18, fontWeight: 'bold' },

  logoutBtn: { padding: 18, borderRadius: 20, alignItems: 'center', borderWidth: 1, marginTop: 10 },
  logoutText: { fontWeight: '800', fontSize: 15 },
  footerText: { textAlign: 'center', fontSize: 11, marginTop: 30, marginBottom: 10 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet:   { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28, paddingBottom: Platform.OS === 'ios' ? 40 : 28, maxHeight: '90%' },
  modalHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  modalTitle:   { fontSize: 18, fontWeight: '800', marginBottom: 20 },
  modalAvatarWrap: { alignSelf: 'center', marginBottom: 6, position: 'relative' },
  modalAvatar:  { width: 80, height: 80, borderRadius: 22 },
  cameraOverlay: {
    position: 'absolute', bottom: -4, right: -4,
    backgroundColor: 'white', width: 28, height: 28, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  uploadHint: { textAlign: 'center', fontSize: 11, marginBottom: 20 },
  fieldLabel:   { fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginBottom: 6 },
  modalInput: {
    borderWidth: 1.5, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, marginBottom: 16,
  },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center' },
  cancelText: { fontWeight: '700', fontSize: 14 },
  saveBtn: { flex: 1, padding: 14, borderRadius: 12, alignItems: 'center', backgroundColor: '#064e3b' },
  saveText: { color: 'white', fontWeight: '700', fontSize: 14 },

  // Password modal
  passwordRow: { position: 'relative' },
  passwordInput: { paddingRight: 50, marginBottom: 16 },
  eyeBtn: { position: 'absolute', right: 14, top: 12 },
  strengthBarBg: { height: 6, borderRadius: 3, marginBottom: 2, overflow: 'hidden' },
  strengthBarFill: { height: 6, borderRadius: 3 },

  // Info cards (used in password modal)
  infoCard: {
    borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 16,
  },
  infoCardTitle: { fontSize: 13, fontWeight: '800', marginBottom: 6 },
  infoCardBody:  { fontSize: 12, lineHeight: 20 },

  // Notifications modal
  notifRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1,
  },

  // Safety modal
  safetySection: {
    borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 14,
  },
  safetySectionTitle: { fontSize: 13, fontWeight: '800', marginBottom: 8 },
  safetyItem: { fontSize: 12, lineHeight: 22 },
});