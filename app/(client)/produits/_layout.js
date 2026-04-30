import React from 'react';
import { Stack } from 'expo-router';

export default function ProduitsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Produits' }} />
      <Stack.Screen name="[id]" options={{ title: 'Détails du produit' }} />
    </Stack>
  );
}
