import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../../Data/AuthContext';
import { useI18n } from '../../Data/traduction';
import { useTheme } from '../../Data/ThemeContext';

export default function AdminProduitsScreen() {
  const { getProduits, ajouterProduit, supprimerProduit, logout } = useAuth();
  const { t, formatPrice } = useI18n();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [produits, setProduits] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [image, setImage] = useState('');

  const chargerProduits = useCallback(async () => {
    const data = await getProduits();
    setProduits(data);
  }, [getProduits]);

  useFocusEffect(
    useCallback(() => {
      chargerProduits();
    }, [chargerProduits])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await chargerProduits();
    setRefreshing(false);
  };

  const handleAjouter = async () => {
    if (!nom.trim() || !prix.trim()) {
      Alert.alert(t('admin_validation_title'), t('admin_name_price_required'));
      return;
    }

    const valeurPrix = Number(prix);
    if (Number.isNaN(valeurPrix) || valeurPrix <= 0) {
      Alert.alert(t('admin_validation_title'), t('admin_price_positive'));
      return;
    }

    await ajouterProduit({ nom, description, prix: valeurPrix, image });
    setNom('');
    setDescription('');
    setPrix('');
    setImage('');
    await chargerProduits();
  };

  const handleSupprimer = (id) => {
    Alert.alert(t('admin_delete_title'), t('admin_delete_question'), [
      { text: t('admin_cancel'), style: 'cancel' },
      {
        text: t('admin_delete'),
        style: 'destructive',
        onPress: async () => {
          await supprimerProduit(id);
          await chargerProduits();
        },
      },
    ]);
  };

  const onLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Text style={styles.title}>{t('admin_title')}</Text>
      <Text style={styles.subtitle}>{t('admin_subtitle')}</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={t('admin_product_name_placeholder')}
          placeholderTextColor={colors.textSoft}
          value={nom}
          onChangeText={setNom}
        />
        <TextInput
          style={styles.input}
          placeholder={t('admin_product_desc_placeholder')}
          placeholderTextColor={colors.textSoft}
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder={t('admin_product_price_placeholder')}
          placeholderTextColor={colors.textSoft}
          value={prix}
          onChangeText={setPrix}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder={t('admin_product_image_placeholder')}
          placeholderTextColor={colors.textSoft}
          value={image}
          onChangeText={setImage}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAjouter}>
          <Text style={styles.addText}>{t('admin_add_product')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={produits}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemNom}>{item.nom}</Text>
              <Text style={styles.itemMeta}>{formatPrice(item.prix)}</Text>
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleSupprimer(item.id)}>
              <Text style={styles.deleteText}>{t('admin_delete')}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Text style={styles.logoutText}>{t('common_logout')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
      textAlign: 'center',
      marginTop: 6,
    },
    subtitle: {
      marginTop: 4,
      color: colors.textSoft,
      marginBottom: 14,
      textAlign: 'center',
    },
    form: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    input: {
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 9,
      marginBottom: 8,
      backgroundColor: colors.surfaceAlt,
      color: colors.text,
    },
    addBtn: {
      marginTop: 4,
      backgroundColor: colors.primary,
      borderRadius: 10,
      alignItems: 'center',
      paddingVertical: 11,
    },
    addText: {
      color: '#fff',
      fontWeight: '700',
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    listContent: {
      paddingBottom: 8,
    },
    itemInfo: {
      flex: 1,
      paddingRight: 10,
    },
    itemNom: {
      fontWeight: '700',
      color: colors.text,
    },
    itemMeta: {
      color: colors.textMuted,
      marginTop: 3,
    },
    deleteBtn: {
      backgroundColor: colors.dangerSoft,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: colors.danger,
    },
    deleteText: {
      color: colors.dangerText,
      fontWeight: '700',
    },
    logoutBtn: {
      marginTop: 10,
      backgroundColor: colors.primary,
      borderRadius: 10,
      alignItems: 'center',
      paddingVertical: 12,
    },
    logoutText: {
      color: '#fff',
      fontWeight: '700',
    },
  });
}
