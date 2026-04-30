import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../Data/AuthContext';

const LABELS_LANGUE = {
  auto: 'Auto',
  fr: 'Francais',
  en: 'English',
  es: 'Espanol',
};

export default function UserHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const langue = LABELS_LANGUE[user.languePreferee] ?? user.languePreferee ?? 'Auto';

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.infoWrap}>
          <Text style={styles.nameText}>Usager: {user.nom}</Text>
          <Text style={styles.langText}>Langue: {langue}</Text>
        </View>

        <Pressable onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Deconnexion</Text>
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
