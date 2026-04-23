import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../../Data/AuthContext';

export default function ProduitsClientScreen() {
  const { getProduits, addToCart } = useAuth();
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nos produits</Text>
      <FlatList
        data={produits}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.nom}>{item.nom}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.prix}>{Number(item.prix).toFixed(2)} $</Text>
            <TouchableOpacity style={styles.button} onPress={() => addToCart(item)}>
              <Text style={styles.buttonText}>Ajouter au panier</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 14,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: '#0f172a',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
  },
  nom: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
    color: '#1e293b',
  },
  description: {
    color: '#475569',
    marginTop: 2,
  },
  prix: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    color: '#0f766e',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#0f766e',
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});