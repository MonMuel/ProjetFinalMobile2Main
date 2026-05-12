import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useCart } from '../../../Data/CartContext';
import { useI18n } from '../../../Data/traduction';
import { useTheme } from '../../../Data/ThemeContext';

export default function ProduitDetailScreen() {
  const { id, nom, description, prix, image } = useLocalSearchParams();
  const { addToCart } = useCart();
  const { t, formatPrice } = useI18n();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [added, setAdded] = useState(false);
  const [imageFailures, setImageFailures] = useState(0);

  const rawUrl = typeof image === 'string' ? image.trim() : '';
  const separator = rawUrl.includes('?') ? '&' : '?';
  const imageSource = !rawUrl
    ? require('../../../assets/logo1.png')
    : imageFailures >= 2
      ? require('../../../assets/logo1.png')
      : imageFailures === 1
        ? { uri: `${rawUrl}${separator}retry=1` }
        : { uri: rawUrl };

  const handleAddToCart = () => {
    addToCart({ id: Number(id), nom, description, prix: Number(prix), image: rawUrl });
    setAdded(true);
    Alert.alert(t('product_alert_title'), t('product_alert_added', { name: nom }));
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Image
        source={imageSource}
        style={styles.image}
        resizeMode="contain"
        onError={() => setImageFailures((prev) => prev + 1)}
      />

      <View style={styles.info}>
        <Text style={styles.nom}>{nom}</Text>
        <Text style={styles.prix}>{formatPrice(prix)}</Text>
        <Text style={styles.description}>{description || t('product_no_description')}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, added && styles.buttonAdded]}
        onPress={handleAddToCart}
      >
        <Text style={styles.buttonText}>
          {added ? t('product_add_again') : t('product_add')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    scroll: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      padding: 16,
      paddingBottom: 40,
    },
    image: {
      width: '100%',
      height: 280,
      borderRadius: 14,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    info: {
      marginTop: 18,
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 14,
    },
    nom: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.text,
    },
    prix: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.primary,
      marginTop: 6,
    },
    description: {
      marginTop: 10,
      fontSize: 15,
      color: colors.textMuted,
      lineHeight: 22,
    },
    button: {
      marginTop: 28,
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
    },
    buttonAdded: {
      backgroundColor: colors.primaryStrong,
    },
    buttonText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 16,
    },
  });
}

