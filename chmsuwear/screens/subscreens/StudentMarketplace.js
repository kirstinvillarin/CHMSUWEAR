// screens/subscreens/StudentMarketplace.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Alert, ActivityIndicator, RefreshControl,
} from 'react-native';
import { supabase } from '../../lib/supabase';

const CATEGORIES = ['All', 'Uniform', 'Books', 'Electronics', 'Lab', 'Others'];

const STATUS_COLORS = {
  active:   { bg: '#dcfce7', text: '#14532d', border: '#bbf7d0' },
  pending:  { bg: '#fef9c3', text: '#854d0e', border: '#fde68a' },
  removed:  { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
  sold:     { bg: '#e0f2fe', text: '#075985', border: '#bae6fd' },
};

const FALLBACK_LISTINGS = [
  { id: '1', title: 'Engineering Drawing Kit', price: 350, category: 'Lab',       status: 'active',  seller_name: 'Maria R.',  created_at: '2024-01-15T10:00:00Z', views: 24 },
  { id: '2', title: 'BSIT PE Uniform Set',     price: 450, category: 'Uniform',   status: 'active',  seller_name: 'Juan D.',   created_at: '2024-01-14T09:30:00Z', views: 41 },
  { id: '3', title: 'Calculus Textbook 7th Ed', price: 180, category: 'Books',    status: 'pending', seller_name: 'Ana S.',    created_at: '2024-01-15T07:00:00Z', views: 8 },
  { id: '4', title: 'Scientific Calculator',   price: 650, category: 'Electronics',status: 'active', seller_name: 'Ben L.',    created_at: '2024-01-13T14:00:00Z', views: 57 },
  { id: '5', title: 'NSTP Module 2024',         price: 80,  category: 'Books',    status: 'removed', seller_name: 'Carla G.',  created_at: '2024-01-12T08:00:00Z', views: 12 },
  { id: '6', title: 'Lab Gown (Size M)',         price: 150, category: 'Lab',     status: 'sold',    seller_name: 'Rico T.',   created_at: '2024-01-11T10:00:00Z', views: 33 },
];

export default function StudentMarketplace() {
  const [listings, setListings]     = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('All');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchListings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('id, title, price, category, status, seller_name, created_at, views')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setListings(data ?? FALLBACK_LISTINGS);
    } catch {
      setListings(FALLBACK_LISTINGS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      listings.filter(l =>
        (category === 'All' || l.category === category) &&
        (l.title.toLowerCase().includes(q) || l.seller_name.toLowerCase().includes(q))
      )
    );
  }, [listings, search, category]);

  const handleRemove = (item) => {
    Alert.alert('Remove Listing?', `Remove "${item.title}" from the marketplace?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive',
        onPress: async () => {
          setActionLoading(item.id);
          try {
            await supabase.from('listings').update({ status: 'removed' }).eq('id', item.id);
          } catch { /* use local */ } finally {
            setListings(prev => prev.map(l => l.id === item.id ? { ...l, status: 'removed' } : l));
            setActionLoading(null);
          }
        },
      },
    ]);
  };

  const handleRestore = async (item) => {
    setActionLoading(item.id);
    try {
      await supabase.from('listings').update({ status: 'active' }).eq('id', item.id);
    } catch { /* use local */ } finally {
      setListings(prev => prev.map(l => l.id === item.id ? { ...l, status: 'active' } : l));
      setActionLoading(null);
    }
  };

  const counts = {
    total:   listings.length,
    active:  listings.filter(l => l.status === 'active').length,
    pending: listings.filter(l => l.status === 'pending').length,
    removed: listings.filter(l => l.status === 'removed').length,
  };

  const renderItem = ({ item }) => {
    const sc = STATUS_COLORS[item.status] || STATUS_COLORS.active;
    const isLoading = actionLoading === item.id;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.sellerText}>by {item.seller_name}</Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: sc.bg, borderColor: sc.border }]}>
            <Text style={[styles.statusText, { color: sc.text }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.cardMeta}>
          <View style={styles.metaChip}><Text style={styles.metaChipText}>₱{item.price.toLocaleString()}</Text></View>
          <View style={styles.metaChip}><Text style={styles.metaChipText}>📁 {item.category}</Text></View>
          <View style={styles.metaChip}><Text style={styles.metaChipText}>👁 {item.views ?? 0} views</Text></View>
          <View style={styles.metaChip}>
            <Text style={styles.metaChipText}>
              {new Date(item.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
            </Text>
          </View>
        </View>

        {isLoading
          ? <ActivityIndicator color="#16a34a" style={{ marginTop: 8 }} />
          : (
            <View style={styles.cardActions}>
              {item.status === 'removed'
                ? (
                  <TouchableOpacity style={styles.restoreBtn} onPress={() => handleRestore(item)} activeOpacity={0.7}>
                    <Text style={styles.restoreBtnText}>↩ Restore</Text>
                  </TouchableOpacity>
                )
                : item.status !== 'sold' && (
                  <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item)} activeOpacity={0.7}>
                    <Text style={styles.removeBtnText}>✗ Remove</Text>
                  </TouchableOpacity>
                )
              }
            </View>
          )
        }
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student Marketplace</Text>
        <Text style={styles.headerSub}>{counts.total} total listings · {counts.active} active</Text>
      </View>

      {/* Summary pills */}
      <View style={styles.summaryRow}>
        {[
          { label: 'Active',  count: counts.active,  color: '#14532d', bg: '#dcfce7' },
          { label: 'Pending', count: counts.pending, color: '#854d0e', bg: '#fef9c3' },
          { label: 'Removed', count: counts.removed, color: '#991b1b', bg: '#fee2e2' },
        ].map((s, i) => (
          <View key={i} style={[styles.summaryPill, { backgroundColor: s.bg }]}>
            <Text style={[styles.summaryPillText, { color: s.color }]}>{s.label}: {s.count}</Text>
          </View>
        ))}
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search listings or seller..."
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Category filter */}
      <View style={styles.catScroll}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={item => item}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 14 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.catChip, category === item && styles.catChipActive]}
              onPress={() => setCategory(item)}
            >
              <Text style={[styles.catChipText, category === item && styles.catChipTextActive]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading
        ? <ActivityIndicator size="large" color="#16a34a" style={{ marginTop: 40 }} />
        : (
          <FlatList
            data={filtered}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchListings(); }} tintColor="#16a34a" />}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyIcon}>🛍️</Text>
                <Text style={styles.emptyText}>No listings found</Text>
              </View>
            }
          />
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: '#f0fdf4' },
  header:             { backgroundColor: '#14532d', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 },
  headerTitle:        { fontSize: 18, fontWeight: '700', color: '#fff' },
  headerSub:          { fontSize: 12, color: '#86efac', marginTop: 2 },
  summaryRow:         { flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 0.5, borderBottomColor: '#d1fae5' },
  summaryPill:        { borderRadius: 99, paddingHorizontal: 12, paddingVertical: 5 },
  summaryPillText:    { fontSize: 11, fontWeight: '700' },
  searchWrap:         { padding: 12, backgroundColor: '#fff' },
  searchInput:        { backgroundColor: '#f0fdf4', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#111827', borderWidth: 1, borderColor: '#bbf7d0' },
  catScroll:          { paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 0.5, borderBottomColor: '#d1fae5' },
  catChip:            { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99, backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#d1fae5' },
  catChipActive:      { backgroundColor: '#14532d', borderColor: '#14532d' },
  catChipText:        { fontSize: 12, fontWeight: '700', color: '#374151' },
  catChipTextActive:  { color: '#fff' },
  list:               { padding: 14, gap: 12, paddingBottom: 32 },
  card:               { backgroundColor: '#fff', borderRadius: 14, borderWidth: 0.5, borderColor: '#d1fae5', padding: 14 },
  cardHeader:         { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  listingTitle:       { fontSize: 14, fontWeight: '700', color: '#111827' },
  sellerText:         { fontSize: 12, color: '#6b7280', marginTop: 2 },
  statusPill:         { borderWidth: 1, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 },
  statusText:         { fontSize: 11, fontWeight: '700' },
  cardMeta:           { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  metaChip:           { backgroundColor: '#f0fdf4', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  metaChipText:       { fontSize: 11, color: '#374151' },
  cardActions:        { flexDirection: 'row', justifyContent: 'flex-end' },
  removeBtn:          { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: '#fee2e2', borderWidth: 1, borderColor: '#fecaca' },
  removeBtnText:      { fontSize: 12, fontWeight: '700', color: '#991b1b' },
  restoreBtn:         { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: '#dcfce7', borderWidth: 1, borderColor: '#bbf7d0' },
  restoreBtnText:     { fontSize: 12, fontWeight: '700', color: '#14532d' },
  empty:              { alignItems: 'center', marginTop: 60 },
  emptyIcon:          { fontSize: 48, marginBottom: 12 },
  emptyText:          { fontSize: 15, color: '#6b7280', fontWeight: '600' },
});