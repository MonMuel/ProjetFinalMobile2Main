import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCart } from '../../Data/CartContext';
import { useI18n } from '../../Data/i18n';

export default function PanierScreen() {
  const { cart, totalPanier, addToCart, retirerDuPanier, viderPanier } = useCart();
  const { t, formatPrice } = useI18n();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const nombreItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantite, 0),
    [cart]
  );

  const handleAcheter = () => {
    if (cart.length === 0) {
      return;
    }
    setShowPurchaseModal(true);
  };

  const handleClosePurchase = () => {
    setShowPurchaseModal(false);
    viderPanier();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('cart_title')}</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={styles.empty}>{t('cart_empty')}</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.thumbnail} resizeMode="cover" />

            <View style={styles.itemInfo}>
              <Text style={styles.name}>{item.nom}</Text>
              <Text style={styles.meta}>{t('cart_unit_price', { price: formatPrice(item.prix) })}</Text>
              <Text style={styles.meta}>{t('cart_product_total', { price: formatPrice(Number(item.prix) * item.quantite) })}</Text>

              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => retirerDuPanier(item.id)}
                >
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{t('cart_quantity', { qty: item.quantite })}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => addToCart(item)}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.meta}>{t('cart_items', { count: nombreItems })}</Text>
        <Text style={styles.total}>{t('cart_total', { price: formatPrice(totalPanier) })}</Text>
        <TouchableOpacity style={styles.clearBtn} onPress={viderPanier}>
          <Text style={styles.clearText}>{t('cart_clear')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buyBtn, cart.length === 0 && styles.buyBtnDisabled]}
          onPress={handleAcheter}
          disabled={cart.length === 0}
        >
          <Text style={styles.buyText}>{t('cart_buy')}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showPurchaseModal}
        transparent
        animationType="fade"
        onRequestClose={handleClosePurchase}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('cart_confirmed')}</Text>
            <Text style={styles.modalText}>{t('cart_thanks')}</Text>
            <Text style={styles.modalText}>{t('cart_items_count', { count: nombreItems })}</Text>
            <Text style={styles.modalText}>{t('cart_total_paid', { price: formatPrice(totalPanier) })}</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={handleClosePurchase}>
              <Text style={styles.modalBtnText}>{t('common_close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    padding: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#7DBBFF',
  },
  item: {
    backgroundColor: '#1A2A3A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderColor: '#0080FF',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#0F1823',
    borderWidth: 1,
    borderColor: '#0080FF',
  },
  itemInfo: {
    flex: 1,
  },
  name: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  meta: {
    color: '#DCEBFF',
    marginTop: 2,
  },
  qtyRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    backgroundColor: '#0080FF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  qtyBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  qtyText: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#0080FF',
    paddingTop: 12,
    marginTop: 6,
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0080FF',
  },
  clearBtn: {
    marginTop: 10,
    backgroundColor: '#b91c1c',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  clearText: {
    color: '#fff',
    fontWeight: '700',
  },
  buyBtn: {
    marginTop: 10,
    backgroundColor: '#0080FF',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buyBtnDisabled: {
    opacity: 0.5,
  },
  buyText: {
    color: '#fff',
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#1A2A3A',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#0080FF',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 15,
    color: '#DCEBFF',
    marginTop: 4,
  },
  modalBtn: {
    marginTop: 16,
    backgroundColor: '#0080FF',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
});