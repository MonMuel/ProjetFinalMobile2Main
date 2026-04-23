import React from 'react';
import { Stack } from 'expo-router';

export default function CompteLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Compte' }} />
      <Stack.Screen name="entrepots" options={{ title: 'Entrepots' }} />
    </Stack>
  );
}
