import React from 'react';
import { Stack } from 'expo-router';

export default function ProduitsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1A2A3A' },
        headerTintColor: '#0080FF',
        headerTitleStyle: { color: '#FFFFFF', fontWeight: '700' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Produits' }} />
      <Stack.Screen name="[id]" options={{ title: 'Détails du produit' }} />
    </Stack>
  );
}
