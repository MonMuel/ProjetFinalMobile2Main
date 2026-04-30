import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '../../Data/AuthContext';
import UserHeader from '../components/UserHeader';

export default function AdminLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/" />;
  }

  if (!user.admin) {
    return <Redirect href="/(client)/produits" />;
  }

  return (
    <View style={styles.container}>
      <UserHeader />
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }} />
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
