import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';

const CartScreen = ({ route, navigation }) => {
  const initialItems = route?.params?.cartItems ?? [];
  const setMarketCart = route?.params?.setCartItems ?? null;

  const [cartItems, setCartItems] = useState(initialItems);

  const syncAndGoBack = (updatedItems) => {
    if (setMarketCart) setMarketCart(updatedItems);
    navigation?.goBack();
  };

  const updateQty = (id, op) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newQty = op === 'inc' ? item.quantity + 1 : item.quantity - 1;
        return newQty < 1 ? item : { ...item, quantity: newQty };
      })
    );
  };

  const removeItem = (id) => {
    Alert.alert('Remove Item', 'Remove this item from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => setCartItems((prev) => prev.filter((i) => i.id !== id)),
      },
    ]);
  };

  const clearCart = () => {
    Alert.alert('Clear Cart', 'Remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: () => setCartItems([]) },
    ]);
  };

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.btnBack}
          onPress={() => syncAndGoBack(cartItems)}
        >
          <Text style={styles.btnBackText}>← Back to Market</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleBlock}>
          <Text style={styles.pageTitle}>Your Shopping Cart</Text>
          <Text style={styles.pageSub}>Review your items before checkout.</Text>
        </View>

        {cartItems.length > 0 ? (
          <>
            <TouchableOpacity style={styles.clearBtn} onPress={clearCart}>
              <Text style={styles.clearBtnText}>🗑️  Clear All Items</Text>
            </TouchableOpacity>

            {cartItems.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image source={item.img} style={styles.itemImg} resizeMode="cover" />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.title}</Text>
                  <Text style={styles.itemUnit}>₱{item.price.toLocaleString()} per unit</Text>
                  <View style={styles.qtyRow}>
                    <TouchableOpacity style={styles.btnQty} onPress={() => updateQty(item.id, 'dec')}>
                      <Text style={styles.btnQtyText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.btnQty} onPress={() => updateQty(item.id, 'inc')}>
                      <Text style={styles.btnQtyText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeItem(item.id)}>
                      <Text style={styles.btnRemove}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.itemSubtotal}>₱{(item.price * item.quantity).toLocaleString()}</Text>
              </View>
            ))}

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Order Total:</Text>
                <Text style={styles.summaryTotal}>₱{total.toLocaleString()}</Text>
              </View>
              <TouchableOpacity
                style={styles.btnCheckout}
                onPress={() => navigation?.navigate('Payment', { total, cartItems })}
              >
                <Text style={styles.btnCheckoutText}>Proceed to Payment</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySub}>Looks like you haven't added any campus gear yet.</Text>
            <TouchableOpacity style={styles.btnBrowse} onPress={() => navigation?.navigate('Market')}>
              <Text style={styles.btnBrowseText}>Browse Market</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
  btnBack: {
    alignSelf: 'flex-start', backgroundColor: 'white',
    paddingVertical: 10, paddingHorizontal: 16,
    borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0',
  },
  btnBackText: { color: '#16a34a', fontWeight: '700', fontSize: 14 },
  titleBlock: { marginBottom: 20 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#064e3b', marginBottom: 4 },
  pageSub: { fontSize: 14, color: '#64748b' },
  clearBtn: { alignSelf: 'flex-end', marginBottom: 14 },
  clearBtnText: { color: '#ef4444', fontSize: 13, fontWeight: '600' },
  cartItem: {
    backgroundColor: 'white', borderRadius: 20, padding: 16,
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 14, borderWidth: 1, borderColor: '#e2e8f0', gap: 12,
  },
  itemImg: { width: 68, height: 68, borderRadius: 12, backgroundColor: '#f1f5f9' },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 3 },
  itemUnit: { fontSize: 12, color: '#64748b', marginBottom: 10 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  btnQty: {
    backgroundColor: '#f1f5f9', width: 32, height: 32,
    borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  btnQtyText: { fontWeight: '800', color: '#475569', fontSize: 16 },
  qtyValue: { fontWeight: '700', color: '#1e293b', fontSize: 16, minWidth: 20, textAlign: 'center' },
  btnRemove: { color: '#ef4444', fontWeight: '700', fontSize: 12, marginLeft: 4 },
  itemSubtotal: { fontSize: 18, fontWeight: '800', color: '#064e3b' },
  summaryCard: { backgroundColor: '#064e3b', borderRadius: 24, padding: 28, marginTop: 24 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  summaryLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 17, fontWeight: '600' },
  summaryTotal: { color: 'white', fontSize: 30, fontWeight: '800' },
  btnCheckout: { backgroundColor: 'white', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  btnCheckoutText: { color: '#064e3b', fontWeight: '800', fontSize: 16 },
  emptyState: {
    backgroundColor: 'white', borderRadius: 24, padding: 60,
    alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', marginTop: 20,
  },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b', marginBottom: 8 },
  emptySub: { fontSize: 15, color: '#64748b', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  btnBrowse: { backgroundColor: '#16a34a', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12 },
  btnBrowseText: { color: 'white', fontWeight: '800', fontSize: 15 },
});

export default CartScreen;