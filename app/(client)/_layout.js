import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../Data/AuthContext';
import UserHeader from '../components/UserHeader';

export default function ClientLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/" />;
  }

  if (user.admin) {
    return <Redirect href="/(admin)" />;
  }

  return (
    <View style={styles.container}>
      <UserHeader />
      <View style={styles.content}>
        <Tabs
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#0f766e',
            tabBarInactiveTintColor: '#64748b',
            tabBarIcon: ({ color, size }) => {
              let iconName = 'ellipse';
              if (route.name === 'produits') iconName = 'cube-outline';
              if (route.name === 'panier') iconName = 'cart-outline';
              if (route.name === 'compte') iconName = 'person-circle-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tabs.Screen name="produits" options={{ title: 'Produits' }} />
          <Tabs.Screen name="panier" options={{ title: 'Panier' }} />
          <Tabs.Screen name="compte" options={{ title: 'Compte' }} />
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  content: {
    flex: 1,
  },
});
