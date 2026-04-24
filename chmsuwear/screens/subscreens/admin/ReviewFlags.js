// screens/subscreens/admin/ReviewFlags.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ActivityIndicator, RefreshControl, TextInput,
} from 'react-native';
import { supabase } from '../../../lib/supabase';

const REASON_COLORS = {
  scam:          { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
  inappropriate: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
  overpriced:    { bg: '#ede9fe', text: '#5b21b6', border: '#ddd6fe' },
  fake:          { bg: '#fee2e2', text: '#9f1239', border: '#fecdd3' },
  other:         { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' },
};

const FALLBACK_REPORTS = [
  { id: '1', listing_title: 'Engineering Drawing Kit',  seller_name: 'John Doe',    price: '₱350', reason: 'overpriced',    description: 'Way too expensive for a used kit.',       status: 'pending',  reporter_name: 'Maria R.', created_at: '2024-01-15T10:00:00Z' },
  { id: '2', listing_title: 'Fake Nike Uniform',        seller_name: 'Unknown Acc', price: '₱200', reason: 'fake',          description: 'This is a counterfeit item.',              status: 'pending',  reporter_name: 'Ben L.',   created_at: '2024-01-15T09:30:00Z' },
  { id: '3', listing_title: 'iPhone 14 Pro Max',        seller_name: 'Seller123',   price: '₱5000',reason: 'scam',          description: 'Seller asked for payment before meetup.',  status: 'pending',  reporter_name: 'Ana S.',   created_at: '2024-01-14T16:00:00Z' },
  { id: '4', listing_title: 'NSTP Module 2024',         seller_name: 'Carla G.',    price: '₱80',  reason: 'inappropriate', description: 'Contains off-campus content.',             status: 'resolved', reporter_name: 'Jake M.',  created_at: '2024-01-13T12:00:00Z' },
  { id: '5', listing_title: 'Old Lab Gown',             seller_name: 'Rico T.',     price: '₱150', reason: 'other',         description: 'Missing buttons and tears.',               status: 'dismissed',reporter_name: 'Lea P.',   created_at: '2024-01-13T08:00:00Z' },
];

export default function ReviewFlags({ navigation }) {
  const [reports, setReports]       = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch]         = useState('');
  const [activeTab, setActiveTab]   = useState('pending');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchReports = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('id, listing_title, seller_name, price, reason, description, status, reporter_name, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setReports(data ?? FALLBACK_REPORTS);
    } catch {
      setReports(FALLBACK_REPORTS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      reports.filter(r =>
        r.status === activeTab &&
        (r.listing_title.toLowerCase().includes(q) || r.reason.toLowerCase().includes(q) || r.seller_name.toLowerCase().includes(q))
      )
    );
  }, [reports, search, activeTab]);

  const handleAction = (report, action) => {
    const labels = { resolved: 'Resolve', dismissed: 'Dismiss', escalated: 'Escalate' };
    Alert.alert(
      `${labels[action]} Report?`,
      `Mark this report as "${action}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: labels[action],
          style: action === 'dismissed' ? 'cancel' : 'default',
          onPress: async () => {
            setActionLoading(report.id);
            try {
              await supabase.from('reports').update({ status: action, resolved_at: new Date().toISOString() }).eq('id', report.id);
              if (action === 'resolved') {
                await supabase.from('listings').update({ status: 'removed' }).eq('title', report.listing_title);
              }
            } catch { /* use local update */ } finally {
              setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: action } : r));
              setActionLoading(null);
              Alert.alert('Done', `Report has been ${action}.`);
            }
          },
        },
      ]
    );
  };

  const counts = {
    pending:   reports.filter(r => r.status === 'pending').length,
    resolved:  reports.filter(r => r.status === 'resolved').length,
    dismissed: reports.filter(r => r.status === 'dismissed').length,
  };

  const renderItem = ({ item }) => {
    const rc = REASON_COLORS[item.reason] || REASON_COLORS.other;
    const isLoading = actionLoading === item.id;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.listingTitle} numberOfLines={1}>{item.listing_title}</Text>
            <Text style={styles.sellerName}>by {item.seller_name} · {item.price}</Text>
          </View>
          <View style={[styles.reasonPill, { backgroundColor: rc.bg, borderColor: rc.border }]}>
            <Text style={[styles.reasonText, { color: rc.text }]}>{item.reason}</Text>
          </View>
        </View>

        <View style={[styles.descBox, { backgroundColor: rc.bg, borderColor: rc.border }]}>
          <Text style={[styles.descText, { color: rc.text }]}>"{item.description}"</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>🚩 Reported by {item.reporter_name}</Text>
          <Text style={styles.metaText}>
            {new Date(item.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
          </Text>
        </View>

        {item.status === 'pending' && (
          <View style={styles.cardActions}>
            {isLoading
              ? <ActivityIndicator color="#16a34a" style={{ flex: 1 }} />
              : (
                <>
                  <TouchableOpacity style={styles.dismissBtn} onPress={() => handleAction(item, 'dismissed')} activeOpacity={0.7}>
                    <Text style={styles.dismissBtnText}>Dismiss</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.resolveBtn} onPress={() => handleAction(item, 'resolved')} activeOpacity={0.7}>
                    <Text style={styles.resolveBtnText}>✓ Remove Listing</Text>
                  </TouchableOpacity>
                </>
              )
            }
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Review Flags</Text>
          <Text style={styles.headerSub}>{counts.pending} pending reports</Text>
        </View>
        <View style={styles.adminBadge}><Text style={styles.adminBadgeText}>ADMIN</Text></View>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by listing, seller, or reason..."
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.tabs}>
        {['pending', 'resolved', 'dismissed'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading
        ? <ActivityIndicator size="large" color="#16a34a" style={{ marginTop: 40 }} />
        : (
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchReports(); }} tintColor="#16a34a" />}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>🚩</Text>
                <Text style={styles.emptyText}>No {activeTab} reports</Text>
              </View>
            }
          />
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#f0fdf4' },
  header:         { backgroundColor: '#14532d', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn:        { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  backArrow:      { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerTitle:    { fontSize: 18, fontWeight: '700', color: '#fff' },
  headerSub:      { fontSize: 12, color: '#86efac', marginTop: 2 },
  adminBadge:     { marginLeft: 'auto', backgroundColor: '#16a34a', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 },
  adminBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  searchWrap:     { padding: 12, backgroundColor: '#fff', borderBottomWidth: 0.5, borderBottomColor: '#d1fae5' },
  searchInput:    { backgroundColor: '#f0fdf4', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#111827', borderWidth: 1, borderColor: '#bbf7d0' },
  tabs:           { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 0.5, borderBottomColor: '#d1fae5' },
  tab:            { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive:      { borderBottomWidth: 2, borderBottomColor: '#16a34a' },
  tabText:        { fontSize: 12, fontWeight: '600', color: '#9ca3af' },
  tabTextActive:  { color: '#14532d' },
  list:           { padding: 14, gap: 12, paddingBottom: 32 },
  card:           { backgroundColor: '#fff', borderRadius: 14, borderWidth: 0.5, borderColor: '#d1fae5', overflow: 'hidden', padding: 14 },
  cardHeader:     { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  listingTitle:   { fontSize: 14, fontWeight: '700', color: '#111827' },
  sellerName:     { fontSize: 12, color: '#6b7280', marginTop: 2 },
  reasonPill:     { borderWidth: 1, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 },
  reasonText:     { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  descBox:        { borderRadius: 10, padding: 10, borderWidth: 1, marginBottom: 10 },
  descText:       { fontSize: 12, fontStyle: 'italic', lineHeight: 18 },
  metaRow:        { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  metaText:       { fontSize: 11, color: '#9ca3af' },
  cardActions:    { flexDirection: 'row', gap: 10 },
  dismissBtn:     { flex: 1, padding: 11, borderRadius: 10, alignItems: 'center', backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' },
  dismissBtnText: { fontSize: 13, fontWeight: '700', color: '#475569' },
  resolveBtn:     { flex: 1, padding: 11, borderRadius: 10, alignItems: 'center', backgroundColor: '#14532d' },
  resolveBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  empty:          { alignItems: 'center', marginTop: 60 },
  emptyIcon:      { fontSize: 48, marginBottom: 12 },
  emptyText:      { fontSize: 15, color: '#6b7280', fontWeight: '600' },
});