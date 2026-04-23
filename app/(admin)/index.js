import React, { useCallback, useState } from 'react';
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
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../../Data/AuthContext';

export default function AdminProduitsScreen() {
  const { getProduits, ajouterProduit, supprimerProduit, logout } = useAuth();
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
      Alert.alert('Validation', 'Nom et prix sont obligatoires');
      return;
    }

    const valeurPrix = Number(prix);
    if (Number.isNaN(valeurPrix) || valeurPrix <= 0) {
      Alert.alert('Validation', 'Le prix doit etre un nombre positif');
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
    Alert.alert('Suppression', 'Voulez-vous supprimer ce produit ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
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
    <View style={styles.container}>
      <Text style={styles.title}>Espace administrateur</Text>
      <Text style={styles.subtitle}>Gestion des produits: ajout, suppression et liste</Text>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Nom du produit" value={nom} onChangeText={setNom} />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Prix"
          value={prix}
          onChangeText={setPrix}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="URL image (optionnel)"
          value={image}
          onChangeText={setImage}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAjouter}>
          <Text style={styles.addText}>Ajouter produit</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={produits}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemNom}>{item.nom}</Text>
              <Text style={styles.itemMeta}>{Number(item.prix).toFixed(2)} $</Text>
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleSupprimer(item.id)}>
              <Text style={styles.deleteText}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Text style={styles.logoutText}>Se deconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    marginTop: 4,
    color: '#475569',
    marginBottom: 10,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginBottom: 8,
  },
  addBtn: {
    marginTop: 4,
    backgroundColor: '#0f766e',
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  itemInfo: {
    flex: 1,
    paddingRight: 10,
  },
  itemNom: {
    fontWeight: '700',
    color: '#0f172a',
  },
  itemMeta: {
    color: '#475569',
    marginTop: 3,
  },
  deleteBtn: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  deleteText: {
    color: '#b91c1c',
    fontWeight: '700',
  },
  logoutBtn: {
    marginTop: 4,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
  },
});