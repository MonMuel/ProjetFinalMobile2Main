import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '../../../Data/AuthContext';

export default function ProduitsListScreen() {
  const router = useRouter();
  const { getProduits } = useAuth();
  const [produits, setProduits] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadProduits = useCallback(async () => {
    const data = await getProduits();
    setProduits(data);
  }, [getProduits]);

  useFocusEffect(
    useCallback(() => {
      loadProduits();
    }, [loadProduits])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProduits();
    setRefreshing(false);
  };

  const goToDetail = (item) => {
    router.push({
      pathname: '/(client)/produits/[id]',
      params: {
        id: item.id,
        nom: item.nom,
        description: item.description ?? '',
        prix: String(item.prix),
        image: item.image ?? '',
      },
    });
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
              source={{ uri: item.image }}
              style={styles.thumbnail}
              resizeMode="cover"
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
