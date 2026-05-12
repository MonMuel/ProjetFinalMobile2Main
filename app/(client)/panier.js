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
import { useI18n } from '../../Data/traduction';
import { useTheme } from '../../Data/ThemeContext';

export default function PanierScreen() {
  const { cart, totalPanier, addToCart, retirerDuPanier, viderPanier } = useCart();
  const { t, formatPrice } = useI18n();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [imageFailures, setImageFailures] = useState({});

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

  const getCartImageSource = (item) => {
    const rawUrl = (item.image ?? '').trim();

    if (!rawUrl) {
      return require('../../assets/logo1.png');
    }

    const failures = imageFailures[item.id] ?? 0;
    if (failures >= 2) {
      return require('../../assets/logo1.png');
    }

    const separator = rawUrl.includes('?') ? '&' : '?';
    return failures === 1 ? { uri: `${rawUrl}${separator}retry=1` } : { uri: rawUrl };
  };

  const handleCartImageError = (itemId) => {
    setImageFailures((prev) => ({ ...prev, [itemId]: (prev[itemId] ?? 0) + 1 }));
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
            <Image
              source={getCartImageSource(item)}
              style={styles.thumbnail}
              resizeMode="cover"
              onError={() => handleCartImageError(item.id)}
            />

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

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 14,
    },
    title: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 10,
    },
    empty: {
      textAlign: 'center',
      marginTop: 40,
      color: colors.textSoft,
    },
    item: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    thumbnail: {
      width: 60,
      height: 60,
      borderRadius: 8,
      backgroundColor: colors.surfaceAlt,
      borderWidth: 1,
      borderColor: colors.border,
    },
    itemInfo: {
      flex: 1,
    },
    name: {
      fontWeight: '700',
      color: colors.text,
    },
    meta: {
      color: colors.textMuted,
      marginTop: 2,
    },
    qtyRow: {
      marginTop: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    qtyBtn: {
      backgroundColor: colors.primary,
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
      color: colors.text,
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 12,
      marginTop: 6,
    },
    total: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
    },
    clearBtn: {
      marginTop: 10,
      backgroundColor: colors.danger,
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
      backgroundColor: colors.primary,
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
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 8,
    },
    modalText: {
      fontSize: 15,
      color: colors.textMuted,
      marginTop: 4,
    },
    modalBtn: {
      marginTop: 16,
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 10,
      alignItems: 'center',
    },
    modalBtnText: {
      color: '#fff',
      fontWeight: '700',
    },
  });
}
