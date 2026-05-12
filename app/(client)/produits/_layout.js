import React from 'react';
import { Stack } from 'expo-router';
import { useI18n } from '../../../Data/traduction';
import { useTheme } from '../../../Data/ThemeContext';

export default function ProduitsLayout() {
  const { t } = useI18n();
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.headerTitle, fontWeight: '700' },
      }}
    >
      <Stack.Screen name="index" options={{ title: t('tabs_products') }} />
      <Stack.Screen name="[id]" options={{ title: t('product_details_title') }} />
    </Stack>
  );
}

