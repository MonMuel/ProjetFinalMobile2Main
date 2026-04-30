import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../Data/AuthContext';
import { useI18n } from '../../Data/i18n';

export default function UserHeader() {
  const { user, logout } = useAuth();
  const { t, languageLabel } = useI18n();

  if (!user) {
    return null;
  }

  const langue = languageLabel(user.languePreferee ?? 'auto');

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.infoWrap}>
          <Text style={styles.nameText}>{t('common_user')}: {user.nom}</Text>
          <Text style={styles.langText}>{t('common_language')}: {langue}</Text>
        </View>

        <Pressable onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>{t('common_logout')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#0B1220',
  },
  container: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#0B1220',
    borderBottomWidth: 1,
    borderBottomColor: '#1F2A3D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoWrap: {
    flexShrink: 1,
  },
  nameText: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 14,
  },
  langText: {
    marginTop: 2,
    color: '#CBD5E1',
    fontSize: 13,
  },
  logoutBtn: {
    backgroundColor: '#B91C1C',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
});
