import React, { useState } from 'react';
import {
  StyleSheet, Text, View, ScrollView, Image,
  TouchableOpacity, SafeAreaView, Dimensions,
  Modal, StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const CATEGORIES = ['All Items', 'Apparel', 'Accessories', 'Merchandise', 'Electronics'];

// ── Extended product data with details ────────────────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    title: 'Varsity Jacket',
    price: '₱1,200',
    tag: 'Apparel',
    img: require('../assets/pic/varsity_jacket.png'),
    preloved: false,
    description:
      'Official Alijis Campus varsity jacket. Made from premium wool-blend fabric with leather sleeves. Features the campus emblem embroidered on the chest.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 12,
    seller: 'Official Campus Store',
    rating: 4.8,
    reviews: 34,
  },
  {
    id: 2,
    title: 'Premium Lanyard',
    price: '₱150',
    tag: 'Accessories',
    img: require('../assets/pic/lanyard.png'),
    preloved: false,
    description:
      'Durable polyester lanyard with the campus logo. Includes a safety breakaway clip and a card holder sleeve. Perfect for student IDs.',
    sizes: ['One Size'],
    stock: 50,
    seller: 'Official Campus Store',
    rating: 4.5,
    reviews: 20,
  },
  {
    id: 3,
    title: 'Canvas Tote Bag',
    price: '₱250',
    tag: 'Merchandise',
    img: require('../assets/pic/totebag.png'),
    preloved: false,
    description:
      'Heavy-duty canvas tote bag with the Alijis Campus print. Fits A4 books and a 13" laptop. Reinforced stitching on handles for extra durability.',
    sizes: ['One Size'],
    stock: 30,
    seller: 'Official Campus Store',
    rating: 4.6,
    reviews: 18,
  },
  {
    id: 4,
    title: 'Scientific Calculator',
    price: '₱850',
    tag: 'Electronics',
    img: require('../assets/pic/scical.png'),
    preloved: true,
    description:
      'Lightly used scientific calculator, fully functional. Supports 417 functions including calculus, statistics, and matrix operations. Batteries included.',
    sizes: ['N/A'],
    stock: 1,
    seller: 'Student: Juan D.',
    rating: 4.2,
    reviews: 5,
  },
];

// ── Star Rating ───────────────────────────────────────────────────────────────
const Stars = ({ rating }) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ fontSize: 13, color: i <= full ? '#f59e0b' : i === full + 1 && half ? '#f59e0b' : '#d1d5db' }}>
          {i <= full ? '★' : i === full + 1 && half ? '½' : '☆'}
        </Text>
      ))}
    </View>
  );
};

// ── Product Detail Modal ──────────────────────────────────────────────────────
const ProductModal = ({ item, visible, onClose, onNavigateToMarket }) => {
  const [selectedSize, setSelectedSize] = useState(0);
  if (!item) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={modal.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={modal.header}>
          <TouchableOpacity onPress={onClose} style={modal.closeBtn}>
            <Text style={modal.closeBtnText}>✕</Text>
          </TouchableOpacity>
          <Text style={modal.headerTitle}>Product Details</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Image */}
          <View style={modal.imgWrapper}>
            <Image source={item.img} style={modal.img} resizeMode="contain" />
            {item.preloved && (
              <View style={modal.prelovedBadge}>
                <Text style={modal.prelovedText}>PRE-LOVED</Text>
              </View>
            )}
          </View>

          <View style={modal.body}>
            {/* Tag + Title */}
            <Text style={modal.tag}>{item.tag.toUpperCase()}</Text>
            <Text style={modal.title}>{item.title}</Text>

            {/* Rating */}
            <View style={modal.ratingRow}>
              <Stars rating={item.rating} />
              <Text style={modal.ratingText}>{item.rating} ({item.reviews} reviews)</Text>
            </View>

            {/* Price + Stock */}
            <View style={modal.priceRow}>
              <Text style={modal.price}>{item.price}</Text>
              <View style={[modal.stockBadge, item.stock <= 3 && modal.stockLow]}>
                <Text style={modal.stockText}>
                  {item.stock <= 3 ? `Only ${item.stock} left!` : `${item.stock} in stock`}
                </Text>
              </View>
            </View>

            {/* Seller */}
            <View style={modal.sellerRow}>
              <Text style={modal.sellerLabel}>Sold by  </Text>
              <Text style={modal.sellerName}>{item.seller}</Text>
            </View>

            {/* Divider */}
            <View style={modal.divider} />

            {/* Description */}
            <Text style={modal.sectionLabel}>Description</Text>
            <Text style={modal.description}>{item.description}</Text>

            {/* Size selector (hidden for N/A) */}
            {item.sizes[0] !== 'N/A' && (
              <>
                <View style={modal.divider} />
                <Text style={modal.sectionLabel}>
                  {item.sizes[0] === 'One Size' ? 'Size' : 'Select Size'}
                </Text>
                <View style={modal.sizeRow}>
                  {item.sizes.map((s, idx) => (
                    <TouchableOpacity
                      key={s}
                      style={[modal.sizeChip, selectedSize === idx && modal.sizeChipActive]}
                      onPress={() => setSelectedSize(idx)}
                    >
                      <Text style={[modal.sizeText, selectedSize === idx && modal.sizeTextActive]}>
                        {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>
        </ScrollView>

        {/* CTA */}
        <View style={modal.footer}>
          <TouchableOpacity style={modal.btnSecondary} onPress={onClose}>
            <Text style={modal.btnSecondaryText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={modal.btnPrimary}
            onPress={() => { onClose(); onNavigateToMarket(); }}
          >
            <Text style={modal.btnPrimaryText}>Go to Market →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// ── Trust Item ────────────────────────────────────────────────────────────────
const TrustItem = ({ icon, title, sub }) => (
  <View style={styles.trustItem}>
    <Text style={styles.trustIcon}>{icon}</Text>
    <Text style={styles.trustTitle}>{title}</Text>
    <Text style={styles.trustSub}>{sub}</Text>
  </View>
);

// ── Product Card ──────────────────────────────────────────────────────────────
const ProductCard = ({ item, onDetails }) => (
  <TouchableOpacity style={styles.productCard} activeOpacity={0.85} onPress={() => onDetails(item)}>
    <View style={styles.imgContainer}>
      <Image source={item.img} style={styles.productImg} resizeMode="cover" />
      {item.preloved && (
        <View style={styles.prelovedBadge}>
          <Text style={styles.prelovedText}>PRE-LOVED</Text>
        </View>
      )}
    </View>
    <View style={styles.productInfo}>
      <Text style={styles.categoryTag}>{item.tag.toUpperCase()}</Text>
      <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>{item.price}</Text>
        <TouchableOpacity style={styles.btnDetails} onPress={() => onDetails(item)}>
          <Text style={styles.btnDetailsText}>Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

// ── Home Screen ───────────────────────────────────────────────────────────────
const HomeScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [selectedItem,   setSelectedItem]   = useState(null);
  const [modalVisible,   setModalVisible]   = useState(false);

  const openDetails = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const filteredProducts =
    activeCategory === 'All Items'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.tag === activeCategory);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>NEW ARRIVAL</Text>
          </View>
          <Text style={styles.bannerTitle}>2026 Varsity Collection</Text>
          <Text style={styles.bannerSub}>Represent Alijis Campus with the latest premium gear.</Text>
          <TouchableOpacity style={styles.btnShop} onPress={() => navigation?.navigate('Market')}>
            <Text style={styles.btnShopText}>Shop Now</Text>
          </TouchableOpacity>
        </View>

        {/* Trust Bar */}
        <View style={styles.trustBar}>
          <TrustItem icon="🛡️" title="Safe Trading"  sub="Verified Students" />
          <View style={styles.trustDivider} />
          <TrustItem icon="📍" title="Campus Pickup" sub="Easy Hand-over" />
          <View style={styles.trustDivider} />
          <TrustItem icon="🌱" title="Sustainable"   sub="Pre-loved Gear" />
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Browse Categories</Text>
        <ScrollView
          horizontal showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catPill, activeCategory === cat && styles.catPillActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.catPillText, activeCategory === cat && styles.catPillTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Items */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Items</Text>
          <TouchableOpacity onPress={() => navigation?.navigate('Market')}>
            <Text style={styles.viewAllText}>View All →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productGrid}>
          {filteredProducts.map((item) => (
            <ProductCard key={item.id} item={item} onDetails={openDetails} />
          ))}
        </View>
      </ScrollView>

      {/* Detail Modal */}
      <ProductModal
        item={selectedItem}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onNavigateToMarket={() => navigation?.navigate('Market')}
      />
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const CARD_WIDTH = (width - 52) / 2;

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { paddingBottom: 32 },

  promoBanner: {
    backgroundColor: '#064e3b', padding: 28, paddingTop: 32,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 4,
    paddingHorizontal: 12, borderRadius: 50, alignSelf: 'flex-start', marginBottom: 10,
  },
  badgeText:   { color: 'white', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  bannerTitle: { color: 'white', fontSize: 28, fontWeight: '800', marginBottom: 8, lineHeight: 34 },
  bannerSub:   { color: '#a7f3d0', fontSize: 14, marginBottom: 20, lineHeight: 20 },
  btnShop: {
    backgroundColor: 'white', paddingVertical: 12,
    paddingHorizontal: 24, borderRadius: 12, alignSelf: 'flex-start',
  },
  btnShopText: { color: '#064e3b', fontWeight: '800', fontSize: 14 },

  trustBar: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: 'white', marginHorizontal: 16, marginTop: 16, marginBottom: 24,
    paddingVertical: 18, borderRadius: 16, borderWidth: 0.5, borderColor: '#e2e8f0',
  },
  trustDivider: { width: 0.5, height: 36, backgroundColor: '#f1f5f9' },
  trustItem:    { alignItems: 'center', flex: 1 },
  trustIcon:    { fontSize: 18, marginBottom: 5 },
  trustTitle:   { fontSize: 12, fontWeight: '700', color: '#064e3b' },
  trustSub:     { fontSize: 10, color: '#64748b', marginTop: 2 },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 12, paddingHorizontal: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 16, marginBottom: 14 },
  viewAllText:   { color: '#16a34a', fontWeight: '700', fontSize: 13 },

  categoryScroll: { paddingLeft: 16, marginBottom: 24 },
  catPill: {
    backgroundColor: 'white', paddingHorizontal: 18, paddingVertical: 9,
    borderRadius: 50, borderWidth: 0.5, borderColor: '#e2e8f0', marginRight: 10,
  },
  catPillActive:     { backgroundColor: '#f0fdf4', borderColor: '#16a34a', borderWidth: 1 },
  catPillText:       { fontWeight: '700', color: '#1e293b', fontSize: 13 },
  catPillTextActive: { color: '#16a34a' },

  productGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 14 },
  productCard: {
    backgroundColor: 'white', width: CARD_WIDTH, borderRadius: 16,
    overflow: 'hidden', borderWidth: 0.5, borderColor: '#e2e8f0',
  },
  imgContainer:  { height: 140, backgroundColor: '#f8fafc', position: 'relative' },
  productImg:    { width: '100%', height: '100%' },
  prelovedBadge: {
    position: 'absolute', top: 8, right: 8, backgroundColor: '#fbbf24',
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 4,
  },
  prelovedText:  { fontSize: 8, fontWeight: '900', color: '#92400e' },
  productInfo:   { padding: 12 },
  categoryTag:   { fontSize: 9, fontWeight: '700', color: '#16a34a', letterSpacing: 0.6, marginBottom: 4 },
  productTitle:  { fontSize: 13, fontWeight: '700', color: '#1e293b', marginBottom: 10 },
  priceRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 0.5, borderTopColor: '#f1f5f9', paddingTop: 10,
  },
  price:          { fontSize: 14, fontWeight: '800', color: '#16a34a' },
  btnDetails:     { backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  btnDetailsText: { fontSize: 10, fontWeight: '700', color: '#475569' },
});

// ── Modal Styles ──────────────────────────────────────────────────────────────
const modal = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 0.5, borderBottomColor: '#e2e8f0', backgroundColor: 'white',
  },
  headerTitle:   { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  closeBtn:      { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  closeBtnText:  { fontSize: 14, color: '#64748b', fontWeight: '700' },

  imgWrapper:    { height: 260, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  img:           { width: '80%', height: '90%' },
  prelovedBadge: { position: 'absolute', top: 12, right: 16, backgroundColor: '#fbbf24', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  prelovedText:  { fontSize: 9, fontWeight: '900', color: '#92400e' },

  body: { padding: 20 },

  tag:   { fontSize: 10, fontWeight: '700', color: '#16a34a', letterSpacing: 0.8, marginBottom: 6 },
  title: { fontSize: 24, fontWeight: '800', color: '#1e293b', marginBottom: 10 },

  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  ratingText: { fontSize: 13, color: '#64748b', fontWeight: '600' },

  priceRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  price:     { fontSize: 28, fontWeight: '800', color: '#064e3b' },
  stockBadge: { backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: '#bbf7d0' },
  stockLow:   { backgroundColor: '#fff7ed', borderColor: '#fed7aa' },
  stockText:  { fontSize: 12, fontWeight: '700', color: '#16a34a' },

  sellerRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  sellerLabel: { fontSize: 13, color: '#64748b' },
  sellerName:  { fontSize: 13, fontWeight: '700', color: '#1e293b' },

  divider:      { height: 0.5, backgroundColor: '#e2e8f0', marginVertical: 16 },
  sectionLabel: { fontSize: 13, fontWeight: '800', color: '#64748b', letterSpacing: 0.5, marginBottom: 8, textTransform: 'uppercase' },
  description:  { fontSize: 14, color: '#475569', lineHeight: 22 },

  sizeRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sizeChip:       { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: 'white' },
  sizeChipActive: { backgroundColor: '#064e3b', borderColor: '#064e3b' },
  sizeText:       { fontSize: 13, fontWeight: '700', color: '#1e293b' },
  sizeTextActive: { color: 'white' },

  footer: {
    flexDirection: 'row', gap: 12, padding: 16,
    borderTopWidth: 0.5, borderTopColor: '#e2e8f0', backgroundColor: 'white',
  },
  btnSecondary: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#e2e8f0', alignItems: 'center',
  },
  btnSecondaryText: { fontWeight: '800', color: '#64748b', fontSize: 15 },
  btnPrimary:       { flex: 2, paddingVertical: 14, borderRadius: 14, backgroundColor: '#16a34a', alignItems: 'center' },
  btnPrimaryText:   { fontWeight: '800', color: 'white', fontSize: 15 },
});

export default HomeScreen;