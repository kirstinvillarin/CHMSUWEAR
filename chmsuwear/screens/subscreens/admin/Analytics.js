// screens/subscreens/admin/Analytics.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 48;

const WEEKLY_TRADES = [12, 19, 8, 25, 34, 42, 38];
const WEEKLY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MAX_TRADE = Math.max(...WEEKLY_TRADES);

const CATEGORY_DATA = [
  { label: 'Uniforms',     value: 38, color: '#16a34a' },
  { label: 'Books',        value: 27, color: '#2563eb' },
  { label: 'Electronics',  value: 18, color: '#d97706' },
  { label: 'Lab Supplies', value: 11, color: '#dc2626' },
  { label: 'Others',       value: 6,  color: '#7c3aed' },
];

const METRICS = [
  { icon: '💰', label: 'Total Revenue',    value: '₱48,230', sub: '↑ 12% this month',    color: '#14532d' },
  { icon: '📦', label: 'Items Sold',       value: '284',      sub: '↑ 34 this week',      color: '#1d4ed8' },
  { icon: '👥', label: 'Active Users',     value: '1,104',    sub: '86% of total',         color: '#7c3aed' },
  { icon: '⏱️', label: 'Avg. Listing Age', value: '3.2 days', sub: 'Before sale',          color: '#b45309' },
];

export default function Analytics({ navigation }) {
  const [period, setPeriod] = useState('week');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSub}>Marketplace overview</Text>
        </View>
        <View style={styles.adminBadge}><Text style={styles.adminBadgeText}>ADMIN</Text></View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Period selector */}
        <View style={styles.periodRow}>
          {['week', 'month', 'year'].map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, period === p && styles.periodBtnActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Metrics */}
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          {METRICS.map((m, i) => (
            <View key={i} style={styles.metricCard}>
              <Text style={styles.metricIcon}>{m.icon}</Text>
              <Text style={styles.metricLabel}>{m.label}</Text>
              <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
              <Text style={styles.metricSub}>{m.sub}</Text>
            </View>
          ))}
        </View>

        {/* Weekly Trade Bar Chart */}
        <Text style={styles.sectionTitle}>Trades This Week</Text>
        <View style={styles.chartCard}>
          <View style={styles.barChart}>
            {WEEKLY_TRADES.map((val, i) => (
              <View key={i} style={styles.barCol}>
                <Text style={styles.barValue}>{val}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { height: `${(val / MAX_TRADE) * 100}%` }]} />
                </View>
                <Text style={styles.barLabel}>{WEEKLY_LABELS[i]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Category Breakdown */}
        <Text style={styles.sectionTitle}>Listings by Category</Text>
        <View style={styles.chartCard}>
          {CATEGORY_DATA.map((cat, i) => (
            <View key={i} style={styles.catRow}>
              <View style={styles.catLabelRow}>
                <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                <Text style={styles.catLabel}>{cat.label}</Text>
                <Text style={styles.catPct}>{cat.value}%</Text>
              </View>
              <View style={styles.catBarTrack}>
                <View style={[styles.catBarFill, { width: `${cat.value}%`, backgroundColor: cat.color }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Quick summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>📋 Summary</Text>
          {[
            'Uniforms remain the top-selling category at 38%.',
            'Friday is the busiest trading day on campus.',
            'Average item sells within 3.2 days of listing.',
            'Student registrations grew 12% vs last month.',
          ].map((line, i) => (
            <Text key={i} style={styles.summaryItem}>• {line}</Text>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#f0fdf4' },
  header:           { backgroundColor: '#14532d', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn:          { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  backArrow:        { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerTitle:      { fontSize: 18, fontWeight: '700', color: '#fff' },
  headerSub:        { fontSize: 12, color: '#86efac', marginTop: 2 },
  adminBadge:       { marginLeft: 'auto', backgroundColor: '#16a34a', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 },
  adminBadgeText:   { color: '#fff', fontSize: 10, fontWeight: '700' },
  content:          { padding: 16, paddingBottom: 40 },
  periodRow:        { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, borderWidth: 0.5, borderColor: '#d1fae5', padding: 4, marginBottom: 20, gap: 4 },
  periodBtn:        { flex: 1, paddingVertical: 8, borderRadius: 9, alignItems: 'center' },
  periodBtnActive:  { backgroundColor: '#14532d' },
  periodText:       { fontSize: 13, fontWeight: '600', color: '#9ca3af' },
  periodTextActive: { color: '#fff' },
  sectionTitle:     { fontSize: 15, fontWeight: '700', color: '#14532d', marginBottom: 12 },
  metricsGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  metricCard:       { backgroundColor: '#fff', borderRadius: 14, borderWidth: 0.5, borderColor: '#d1fae5', padding: 14, width: '48%' },
  metricIcon:       { fontSize: 20, marginBottom: 6 },
  metricLabel:      { fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  metricValue:      { fontSize: 20, fontWeight: '700' },
  metricSub:        { fontSize: 11, color: '#9ca3af', marginTop: 3 },
  chartCard:        { backgroundColor: '#fff', borderRadius: 14, borderWidth: 0.5, borderColor: '#d1fae5', padding: 16, marginBottom: 24 },
  barChart:         { flexDirection: 'row', alignItems: 'flex-end', height: 140, gap: 6 },
  barCol:           { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  barValue:         { fontSize: 9, color: '#6b7280', marginBottom: 3, fontWeight: '700' },
  barTrack:         { width: '70%', height: 110, backgroundColor: '#f0fdf4', borderRadius: 6, overflow: 'hidden', justifyContent: 'flex-end' },
  barFill:          { width: '100%', backgroundColor: '#16a34a', borderRadius: 6 },
  barLabel:         { fontSize: 9, color: '#9ca3af', marginTop: 4, fontWeight: '600' },
  catRow:           { marginBottom: 14 },
  catLabelRow:      { flexDirection: 'row', alignItems: 'center', marginBottom: 5, gap: 6 },
  catDot:           { width: 10, height: 10, borderRadius: 5 },
  catLabel:         { flex: 1, fontSize: 13, color: '#374151', fontWeight: '600' },
  catPct:           { fontSize: 13, fontWeight: '700', color: '#14532d' },
  catBarTrack:      { height: 8, backgroundColor: '#f0fdf4', borderRadius: 4, overflow: 'hidden' },
  catBarFill:       { height: 8, borderRadius: 4 },
  summaryCard:      { backgroundColor: '#fff', borderRadius: 14, borderWidth: 0.5, borderColor: '#d1fae5', padding: 16 },
  summaryTitle:     { fontSize: 14, fontWeight: '700', color: '#14532d', marginBottom: 10 },
  summaryItem:      { fontSize: 13, color: '#374151', lineHeight: 22 },
});
