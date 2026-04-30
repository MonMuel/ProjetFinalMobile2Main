import React from 'react';
import { Stack } from 'expo-router';
import { useI18n } from '../../../Data/i18n';

export default function ProduitsLayout() {
  const { t } = useI18n();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1A2A3A' },
        headerTintColor: '#0080FF',
        headerTitleStyle: { color: '#FFFFFF', fontWeight: '700' },
      }}
    >
      <Stack.Screen name="index" options={{ title: t('tabs_products') }} />
      <Stack.Screen name="[id]" options={{ title: t('product_details_title') }} />
    </Stack>
  );
}
