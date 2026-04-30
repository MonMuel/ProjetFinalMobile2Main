import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../Data/AuthContext';

export default function AdminLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/" />;
  }

  if (!user.admin) {
    return <Redirect href="/(client)/produits" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
