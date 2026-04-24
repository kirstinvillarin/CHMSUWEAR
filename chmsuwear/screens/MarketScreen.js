import React, { useState, useRef } from 'react';
import {
  StyleSheet, Text, View, ScrollView, Image,
  TouchableOpacity, SafeAreaView, Dimensions, Animated,
  Modal, StatusBar,
} from 'react-native';

const { width } = Dimensions.get('window');

const CATEGORIES = ['All Items', 'Apparel', 'Accessories', 'Merchandise', 'Electronics'];

const PRODUCTS = [
  {
    id: 1,
    title: 'Varsity Jacket',
    price: 1200,
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
    price: 150,
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
    price: 250,
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
    price: 850,
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

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ message, visible }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(1400),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, message]);

  return (
    <Animated.View style={[styles.toast, { opacity }]}>
      <Text style={styles.toastText}>✓  {message}</Text>
    </Animated.View>
  );
};

// ─── Star Rating ──────────────────────────────────────────────────────────────
const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text
          key={i}
          style={{
            fontSize: 13,
            color:
              i <= full
                ? '#f59e0b'
                : i === full + 1 && half
                ? '#f59e0b'
                : '#d1d5db',
          }}
        >
          {i <= full ? '★' : i === full + 1 && half ? '½' : '☆'}
        </Text>
      ))}
    </View>
  );
};

// ─── Product Detail Modal ─────────────────────────────────────────────────────
const ProductModal = ({ item, visible, onClose, onAddToCart, justAdded }) => {
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
              <Text style={modal.ratingText}>
                {item.rating} ({item.reviews} reviews)
              </Text>
            </View>

            {/* Price + Stock */}
            <View style={modal.priceRow}>
              <Text style={modal.price}>₱{item.price.toLocaleString()}</Text>
              <View style={[modal.stockBadge, item.stock <= 3 && modal.stockLow]}>
                <Text style={modal.stockText}>
                  {item.stock <= 3
                    ? `Only ${item.stock} left!`
                    : `${item.stock} in stock`}
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
                      style={[
                        modal.sizeChip,
                        selectedSize === idx && modal.sizeChipActive,
                      ]}
                      onPress={() => setSelectedSize(idx)}
                    >
                      <Text
                        style={[
                          modal.sizeText,
                          selectedSize === idx && modal.sizeTextActive,
                        ]}
                      >
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
            style={[modal.btnPrimary, justAdded && modal.btnPrimaryAdded]}
            onPress={() => {
              onAddToCart(item);
              onClose();
            }}
          >
            <Text style={modal.btnPrimaryText}>
              {justAdded ? '✓ Added!' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ item, onAddToCart, justAdded, onDetails }) => (
  <View style={styles.productCard}>
    <TouchableOpacity
      style={styles.imgContainer}
      activeOpacity={0.85}
      onPress={() => onDetails(item)}
    >
      <Image source={item.img} style={styles.productImg} resizeMode="cover" />
      {item.preloved && (
        <View style={styles.prelovedBadge}>
          <Text style={styles.prelovedText}>PRE-LOVED</Text>
        </View>
      )}
    </TouchableOpacity>
    <View style={styles.productInfo}>
      <Text style={styles.categoryTag}>{item.tag.toUpperCase()}</Text>
      <TouchableOpacity onPress={() => onDetails(item)}>
        <Text style={styles.productTitle} numberOfLines={1}>
          {item.title}
        </Text>
      </TouchableOpacity>
      <View style={styles.priceRow}>
        <Text style={styles.price}>₱{item.price.toLocaleString()}</Text>
        <View style={styles.actionBtns}>
          <TouchableOpacity
            style={styles.btnDetails}
            onPress={() => onDetails(item)}
          >
            <Text style={styles.btnDetailsText}>Info</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnAdd, justAdded && styles.btnAdded]}
            onPress={() => onAddToCart(item)}
            activeOpacity={0.8}
          >
            <Text style={styles.btnAddText}>{justAdded ? '✓' : 'Add'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const MarketScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [cartItems, setCartItems]           = useState([]);
  const [toastMsg, setToastMsg]             = useState('');
  const [toastVisible, setToastVisible]     = useState(false);
  const [justAddedId, setJustAddedId]       = useState(null);
  const [selectedItem, setSelectedItem]     = useState(null);
  const [modalVisible, setModalVisible]     = useState(false);
  const toastKey = useRef(0);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleAddToCart = (product) => {
    const alreadyIn = cartItems.some((i) => i.id === product.id);

    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    toastKey.current += 1;
    setToastMsg(
      alreadyIn
        ? `${product.title} is already in your cart (+1 added)`
        : `${product.title} added to cart!`
    );
    setToastVisible(false);
    setTimeout(() => setToastVisible(true), 10);

    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1500);
  };

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={styles.pageTitle}>Campus Market</Text>
          <Text style={styles.pageSub}>Find official gear and student listings.</Text>
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catPill, activeCategory === cat && styles.catPillActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text
                style={[
                  styles.catPillText,
                  activeCategory === cat && styles.catPillTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Product Grid */}
        <View style={styles.productGrid}>
          {filteredProducts.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
              justAdded={justAddedId === item.id}
              onDetails={openDetails}
            />
          ))}
        </View>
      </ScrollView>

      {/* Toast */}
      <Toast key={toastKey.current} message={toastMsg} visible={toastVisible} />

      {/* Cart FAB */}
      <TouchableOpacity
        style={styles.cartFab}
        onPress={() => navigation.navigate('Cart', { cartItems, setCartItems })}
      >
        <Text style={styles.cartFabIcon}>🛒</Text>
        {cartCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Product Detail Modal */}
      <ProductModal
        item={selectedItem}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddToCart={handleAddToCart}
        justAdded={selectedItem ? justAddedId === selectedItem.id : false}
      />
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const CARD_WIDTH = (width - 52) / 2;

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { padding: 20, paddingBottom: 100 },

  titleBlock: { marginBottom: 20 },
  pageTitle:  { fontSize: 28, fontWeight: '800', color: '#064e3b' },
  pageSub:    { fontSize: 14, color: '#64748b', marginTop: 4 },

  categoryScroll: { marginBottom: 20 },
  catPill: {
    backgroundColor: 'white', paddingHorizontal: 18, paddingVertical: 9,
    borderRadius: 50, borderWidth: 0.5, borderColor: '#e2e8f0', marginRight: 10,
  },
  catPillActive:     { backgroundColor: '#f0fdf4', borderColor: '#16a34a', borderWidth: 1 },
  catPillText:       { fontWeight: '700', color: '#1e293b', fontSize: 13 },
  catPillTextActive: { color: '#16a34a' },

  productGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  productCard: {
    backgroundColor: 'white', width: CARD_WIDTH, borderRadius: 16,
    overflow: 'hidden', borderWidth: 0.5, borderColor: '#e2e8f0', marginBottom: 4,
  },
  imgContainer:  { height: 160, backgroundColor: '#f1f5f9', position: 'relative' },
  productImg:    { width: '100%', height: '100%' },
  prelovedBadge: {
    position: 'absolute', top: 10, right: 10, backgroundColor: '#fbbf24',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  prelovedText:  { fontSize: 8, fontWeight: '900', color: '#92400e' },
  productInfo:   { padding: 14 },
  categoryTag:   { fontSize: 9, fontWeight: '700', color: '#64748b', letterSpacing: 0.6, marginBottom: 4 },
  productTitle:  { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  priceRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  price: { fontSize: 16, fontWeight: '800', color: '#064e3b' },

  actionBtns: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  btnDetails: {
    backgroundColor: '#f1f5f9', paddingHorizontal: 10,
    paddingVertical: 7, borderRadius: 9,
  },
  btnDetailsText: { fontSize: 11, fontWeight: '700', color: '#475569' },

  btnAdd: {
    backgroundColor: '#16a34a', paddingHorizontal: 14,
    paddingVertical: 8, borderRadius: 10, minWidth: 44, alignItems: 'center',
  },
  btnAdded:   { backgroundColor: '#059669' },
  btnAddText: { color: 'white', fontWeight: '800', fontSize: 13 },

  // Toast
  toast: {
    position: 'absolute', bottom: 110, alignSelf: 'center',
    backgroundColor: '#1e293b', paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 24, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 8,
  },
  toastText: { color: 'white', fontWeight: '700', fontSize: 13 },

  // FAB
  cartFab: {
    position: 'absolute', bottom: 30, right: 20, backgroundColor: '#16a34a',
    width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center',
    elevation: 6, shadowColor: '#16a34a', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8,
  },
  cartFabIcon: { fontSize: 24 },
  cartBadge: {
    position: 'absolute', top: -2, right: -2, backgroundColor: '#ef4444',
    width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  cartBadgeText: { color: 'white', fontSize: 11, fontWeight: '800' },
});

// ─── Modal Styles ─────────────────────────────────────────────────────────────
const modal = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 0.5, borderBottomColor: '#e2e8f0', backgroundColor: 'white',
  },
  headerTitle:  { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  closeBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { fontSize: 14, color: '#64748b', fontWeight: '700' },

  imgWrapper:    { height: 260, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  img:           { width: '80%', height: '90%' },
  prelovedBadge: { position: 'absolute', top: 12, right: 16, backgroundColor: '#fbbf24', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  prelovedText:  { fontSize: 9, fontWeight: '900', color: '#92400e' },

  body: { padding: 20 },

  tag:   { fontSize: 10, fontWeight: '700', color: '#16a34a', letterSpacing: 0.8, marginBottom: 6 },
  title: { fontSize: 24, fontWeight: '800', color: '#1e293b', marginBottom: 10 },

  ratingRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  ratingText: { fontSize: 13, color: '#64748b', fontWeight: '600' },

  priceRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  price:      { fontSize: 28, fontWeight: '800', color: '#064e3b' },
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
  btnSecondary:     { flex: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, borderColor: '#e2e8f0', alignItems: 'center' },
  btnSecondaryText: { fontWeight: '800', color: '#64748b', fontSize: 15 },
  btnPrimary:       { flex: 2, paddingVertical: 14, borderRadius: 14, backgroundColor: '#16a34a', alignItems: 'center' },
  btnPrimaryAdded:  { backgroundColor: '#059669' },
  btnPrimaryText:   { fontWeight: '800', color: 'white', fontSize: 15 },
});

export default MarketScreen;