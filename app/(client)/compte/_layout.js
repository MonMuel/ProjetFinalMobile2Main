import React from 'react';
import { Stack } from 'expo-router';
import { useI18n } from '../../../Data/traduction';
import { useTheme } from '../../../Data/ThemeContext';

export default function CompteLayout() {
  const { t } = useI18n();
  const { colors } = useTheme();

  const headerStyle = {
    headerStyle: { backgroundColor: colors.surface },
    headerTintColor: colors.text,
    headerTitleStyle: { fontWeight: '700' },
  };

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: t('tabs_account'), ...headerStyle }} />
      <Stack.Screen name="entrepots" options={{ title: t('warehouses_title'), ...headerStyle }} />
    </Stack>
  );
}

