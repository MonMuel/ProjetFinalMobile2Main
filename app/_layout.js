import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../Data/AuthContext';

export default function RootLayout() {
return (
<AuthProvider>
<Stack screenOptions={{ headerShown: false }}>
<Stack.Screen name="index" />
<Stack.Screen name="(client)" />
<Stack.Screen name="(admin)" />
</Stack>
</AuthProvider>
);
}
