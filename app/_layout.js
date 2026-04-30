import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../Data/AuthContext';
import { CartProvider } from '../Data/CartContext';

export default function RootLayout() {
return (
<AuthProvider>
<CartProvider>
<Stack screenOptions={{ headerShown: false }}>
<Stack.Screen name="index" />
<Stack.Screen name="(client)" />
<Stack.Screen name="(admin)" />
</Stack>
</CartProvider>
</AuthProvider>
);
}
