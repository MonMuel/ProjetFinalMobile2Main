import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../Data/AuthContext';

export default function ProduitsListScreen() {
  const router = useRouter();
  const { getProduits } = useAuth();
  const isNavigatingRef = useRef(false);
  const [produits, setProduits] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [imageFailures, setImageFailures] = useState({});

  const loadProduits = useCallback(async (resetBroken = false) => {
    const data = await getProduits();
    if (resetBroken) {
      setImageFailures({});
    }
    setProduits(data);
  }, [getProduits]);

  useEffect(() => {
    loadProduits();
  }, [loadProduits]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProduits(true);
    setRefreshing(false);
  };

  const goToDetail = (item) => {
    if (isNavigatingRef.current) {
      return;
    }

    isNavigatingRef.current = true;
    router.push({
      pathname: '/(client)/produits/[id]',
      params: {
        id: String(item.id),
        nom: item.nom,
        description: item.description ?? '',
        prix: String(item.prix),
        image: item.image ?? '',
      },
    });

    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 400);
  };

  const getItemImageSource = (item) => {
    const rawUrl = (item.image ?? '').trim();
    if (!rawUrl) {
      return require('../../../assets/logo1.png');
    }

    const failures = imageFailures[item.id] ?? 0;
    if (failures >= 2) {
      return require('../../../assets/logo1.png');
    }

    const separator = rawUrl.includes('?') ? '&' : '?';
    return failures === 1 ? { uri: `${rawUrl}${separator}retry=1` } : { uri: rawUrl };
  };

  const handleItemImageError = (itemId) => {
    setImageFailures((prev) => ({ ...prev, [itemId]: (prev[itemId] ?? 0) + 1 }));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={produits}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => goToDetail(item)}
          >
            <Image
              source={getItemImageSource(item)}
              style={styles.thumbnail}
              resizeMode="cover"
              onError={() => handleItemImageError(item.id)}
            />
            <Text style={styles.nom} numberOfLines={1}>{item.nom}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  list: {
    padding: 14,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A2A3A',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#0080FF',
    elevation: 4,
    shadowColor: '#000080',
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  cardPressed: {
    opacity: 0.75,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#0F1823',
    borderWidth: 1,
    borderColor: '#0080FF',
  },
  nom: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
