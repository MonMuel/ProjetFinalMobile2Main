import React from 'react';
import { Stack } from 'expo-router';
import { useI18n } from '../../../Data/i18n';

export default function CompteLayout() {
  const { t } = useI18n();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: t('tabs_account') }} />
      <Stack.Screen name="entrepots" options={{ title: t('warehouses_title') }} />
    </Stack>
  );
}
