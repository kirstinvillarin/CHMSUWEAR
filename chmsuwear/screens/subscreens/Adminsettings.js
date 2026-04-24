// screens/subscreens/Adminsettings.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, Alert, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function Adminsettings({ navigation }) {
  const [adminEmail, setAdminEmail]   = useState('');
  const [loading, setLoading]         = useState(true);

  // Platform toggles
  const [settings, setSettings] = useState({
    maintenanceMode:   false,
    allowNewListings:  true,
    requireIdVerify:   true,
    allowGuestBrowse:  false,
    autoFlagKeywords:  true,
    emailNotifications: true,
  });

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setAdminEmail(user?.email ?? 'admin@chmsu.edu.ph');
      setLoading(false);
    };
    fetch();
  }, []);

  const toggleSetting = (key) =>
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out as admin?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out', style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          navigation.replace('Login');
        },
      },
    ]);
  };

  const handleMaintenanceToggle = (val) => {
    if (val) {
      Alert.alert(
        '⚠️ Enable Maintenance Mode?',
        'This will make the marketplace unavailable to all students. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enable', style: 'destructive', onPress: () => toggleSetting('maintenanceMode') },
        ]
      );
    } else {
      toggleSetting('maintenanceMode');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#16a34a" />
      </SafeAreaView>
    );
  }

  const SettingRow = ({ icon, label, desc, value, onToggle, danger = false }) => (
    <View style={[styles.settingRow, danger && { backgroundColor: '#fff1f2' }]}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconBox, danger && { backgroundColor: '#fee2e2', borderColor: '#fecaca' }]}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.settingLabel, danger && { color: '#991b1b' }]}>{label}</Text>
          <Text style={styles.settingDesc}>{desc}</Text>
        </View>
      </View>
      <Switch
        trackColor={{ false: '#e2e8f0', true: danger ? '#dc2626' : '#16a34a' }}
        thumbColor="#fff"
        ios_backgroundColor="#e2e8f0"
        value={value}
        onValueChange={onToggle}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Settings</Text>
        <Text style={styles.headerSub}>Platform configuration</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Admin profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AD</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>Administrator</Text>
            <Text style={styles.profileEmail}>{adminEmail}</Text>
          </View>
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>ADMIN</Text>
          </View>
        </View>

        {/* Platform Controls */}
        <Text style={styles.sectionTitle}>Platform Controls</Text>
        <View style={styles.card}>
          <SettingRow
            icon="🔧"
            label="Maintenance Mode"
            desc="Temporarily disable the marketplace"
            value={settings.maintenanceMode}
            onToggle={handleMaintenanceToggle}
            danger
          />
          <View style={styles.divider} />
          <SettingRow
            icon="🛍️"
            label="Allow New Listings"
            desc="Let students post new items"
            value={settings.allowNewListings}
            onToggle={() => toggleSetting('allowNewListings')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="🎓"
            label="Require ID Verification"
            desc="New users must verify student ID"
            value={settings.requireIdVerify}
            onToggle={() => toggleSetting('requireIdVerify')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="👁️"
            label="Guest Browsing"
            desc="Non-registered users can view listings"
            value={settings.allowGuestBrowse}
            onToggle={() => toggleSetting('allowGuestBrowse')}
          />
        </View>

        {/* Moderation */}
        <Text style={styles.sectionTitle}>Moderation</Text>
        <View style={styles.card}>
          <SettingRow
            icon="🚨"
            label="Auto-Flag Keywords"
            desc="Auto-detect suspicious listing content"
            value={settings.autoFlagKeywords}
            onToggle={() => toggleSetting('autoFlagKeywords')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="📧"
            label="Email Notifications"
            desc="Receive admin alerts via email"
            value={settings.emailNotifications}
            onToggle={() => toggleSetting('emailNotifications')}
          />
        </View>

        {/* Admin Actions */}
        <Text style={styles.sectionTitle}>Admin Actions</Text>
        <View style={styles.card}>
          {[
            { icon: '📊', label: 'Export Report',     sub: 'Download CSV of all activity',  onPress: () => Alert.alert('Export', 'CSV report will be sent to your email.') },
            { icon: '🗑️', label: 'Clear Flagged Cache', sub: 'Remove auto-dismissed flags', onPress: () => Alert.alert('Cleared', 'Flagged cache has been cleared.') },
            { icon: '🔄', label: 'Sync Student List',  sub: 'Re-import from registrar',     onPress: () => Alert.alert('Synced', 'Student list refreshed from registrar data.') },
          ].map((action, i, arr) => (
            <React.Fragment key={i}>
              <TouchableOpacity style={styles.actionRow} onPress={action.onPress} activeOpacity={0.7}>
                <View style={styles.iconBox}>
                  <Text style={styles.iconText}>{action.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingLabel}>{action.label}</Text>
                  <Text style={styles.settingDesc}>{action.sub}</Text>
                </View>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
              {i < arr.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        {/* App info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoItem}>📱 CHMSU Wear v1.2.0</Text>
          <Text style={styles.infoItem}>🏫 Alijis Campus Marketplace</Text>
          <Text style={styles.infoItem}>👩‍💻 Created by LTV GALS</Text>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Log Out Admin Account</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#f0fdf4' },
  header:          { backgroundColor: '#14532d', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  headerTitle:     { fontSize: 20, fontWeight: '700', color: '#fff' },
  headerSub:       { fontSize: 13, color: '#86efac', marginTop: 2 },
  content:         { padding: 16, paddingBottom: 40, gap: 14 },
  profileCard:     { backgroundColor: '#fff', borderRadius: 16, borderWidth: 0.5, borderColor: '#d1fae5', padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar:          { width: 50, height: 50, borderRadius: 25, backgroundColor: '#14532d', justifyContent: 'center', alignItems: 'center' },
  avatarText:      { color: '#fff', fontSize: 16, fontWeight: '700' },
  profileName:     { fontSize: 16, fontWeight: '700', color: '#111827' },
  profileEmail:    { fontSize: 12, color: '#6b7280', marginTop: 2 },
  adminBadge:      { backgroundColor: '#14532d', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
  adminBadgeText:  { color: '#fff', fontSize: 10, fontWeight: '700' },
  sectionTitle:    { fontSize: 13, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 },
  card:            { backgroundColor: '#fff', borderRadius: 16, borderWidth: 0.5, borderColor: '#d1fae5', overflow: 'hidden' },
  settingRow:      { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  actionRow:       { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  settingLeft:     { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox:         { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#d1fae5', justifyContent: 'center', alignItems: 'center' },
  iconText:        { fontSize: 18 },
  settingLabel:    { fontSize: 14, fontWeight: '700', color: '#111827' },
  settingDesc:     { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  arrow:           { fontSize: 18, color: '#d1fae5', fontWeight: '700' },
  divider:         { height: 0.5, backgroundColor: '#f0fdf4', marginHorizontal: 14 },
  infoCard:        { backgroundColor: '#fff', borderRadius: 14, borderWidth: 0.5, borderColor: '#d1fae5', padding: 16, gap: 6 },
  infoItem:        { fontSize: 13, color: '#6b7280' },
  logoutBtn:       { backgroundColor: '#fff1f2', borderWidth: 1, borderColor: '#ffe4e6', borderRadius: 16, padding: 18, alignItems: 'center', marginTop: 4 },
  logoutText:      { color: '#e11d48', fontWeight: '800', fontSize: 15 },
});