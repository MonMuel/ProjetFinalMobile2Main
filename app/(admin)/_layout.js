import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '../../Data/AuthContext';
import { useTheme } from '../../Data/ThemeContext';
import UserHeader from '../components/UserHeader';

export default function AdminLayout() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles(colors);

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

