import React from 'react';
import { Stack } from 'expo-router';
import { useI18n } from '../../../Data/i18n';

export default function CompteLayout() {
  const { t } = useI18n();

  const headerStyle = {
    headerStyle: { backgroundColor: '#1A2A3A' },
    headerTintColor: '#FFFFFF',
    headerTitleStyle: { fontWeight: '700' },
  };

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: t('tabs_account'), ...headerStyle }} />
      <Stack.Screen name="entrepots" options={{ title: t('warehouses_title'), ...headerStyle }} />
    </Stack>
  );
}
