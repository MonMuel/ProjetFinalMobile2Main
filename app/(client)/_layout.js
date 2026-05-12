import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../Data/AuthContext';
import { useI18n } from '../../Data/traduction';
import { useTheme } from '../../Data/ThemeContext';
import UserHeader from '../components/UserHeader';

export default function ClientLayout() {
  const { user } = useAuth();
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = createStyles(colors);

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
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopColor: colors.borderSoft,
            },
            tabBarActiveTintColor: colors.tabActive,
            tabBarInactiveTintColor: colors.tabInactive,
            tabBarIcon: ({ color, size }) => {
              let iconName = 'ellipse';
              if (route.name === 'produits') iconName = 'cube-outline';
              if (route.name === 'panier') iconName = 'cart-outline';
              if (route.name === 'compte') iconName = 'person-circle-outline';
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tabs.Screen name="produits" options={{ title: t('tabs_products') }} />
          <Tabs.Screen name="panier" options={{ title: t('tabs_cart') }} />
          <Tabs.Screen name="compte" options={{ title: t('tabs_account') }} />
        </Tabs>
      </View>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
  });
}

