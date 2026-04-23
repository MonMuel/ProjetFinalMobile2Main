import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../Data/AuthContext';

export default function PanierScreen() {
  const { cart, totalPanier, retirerDuPanier, viderPanier } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Votre panier</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={styles.empty}>Le panier est vide.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.name}>{item.nom}</Text>
              <Text style={styles.meta}>
                {item.quantite} x {Number(item.prix).toFixed(2)} $
              </Text>
            </View>
            <TouchableOpacity style={styles.removeBtn} onPress={() => retirerDuPanier(item.id)}>
              <Text style={styles.removeText}>Retirer</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.total}>Total: {totalPanier.toFixed(2)} $</Text>
        <TouchableOpacity style={styles.clearBtn} onPress={viderPanier}>
          <Text style={styles.clearText}>Vider panier</Text>
        </TouchableOpacity>
      </View>
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
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#64748b',
  },
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontWeight: '700',
    color: '#0f172a',
  },
  meta: {
    color: '#475569',
    marginTop: 2,
  },
  removeBtn: {
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  removeText: {
    fontWeight: '600',
    color: '#1e293b',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
    paddingTop: 12,
    marginTop: 6,
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
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
});