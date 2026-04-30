import React, { useState } from 'react';
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
import { useAuth } from '../../../Data/AuthContext';

export default function ProduitDetailScreen() {
  const { id, nom, description, prix, image } = useLocalSearchParams();
  const { addToCart } = useAuth();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({ id: Number(id), nom, description, prix: Number(prix), image });
    setAdded(true);
    Alert.alert('Panier', `"${nom}" ajouté au panier.`);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Image
        source={{ uri: image }}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.info}>
        <Text style={styles.nom}>{nom}</Text>
        <Text style={styles.prix}>{Number(prix).toFixed(2)} $</Text>
        <Text style={styles.description}>{description || 'Aucune description disponible.'}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, added && styles.buttonAdded]}
        onPress={handleAddToCart}
      >
        <Text style={styles.buttonText}>
          {added ? 'Ajouter à nouveau' : 'Ajouter au panier'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 280,
    borderRadius: 14,
    backgroundColor: '#1A2A3A',
    borderWidth: 1,
    borderColor: '#0080FF',
  },
  info: {
    marginTop: 18,
    backgroundColor: '#1A2A3A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#0080FF',
    padding: 14,
  },
  nom: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  prix: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0080FF',
    marginTop: 6,
  },
  description: {
    marginTop: 10,
    fontSize: 15,
    color: '#DCEBFF',
    lineHeight: 22,
  },
  button: {
    marginTop: 28,
    backgroundColor: '#0080FF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonAdded: {
    backgroundColor: '#1E40AF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
