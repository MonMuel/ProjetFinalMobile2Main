import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../Data/AuthContext';

const LANGUES = [
  { key: 'fr', label: 'Fr' },
  { key: 'en', label: 'En' },
  { key: 'auto', label: 'Auto' },
];

function RadioOption({ label, active, onPress }) {
  return (
    <Pressable style={styles.radioRow} onPress={onPress}>
      <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
        {active ? <View style={styles.radioInner} /> : null}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </Pressable>
  );
}

export default function CompteScreen() {
  const router = useRouter();
  const { user, logout, updateProfile } = useAuth();
  const [mdp, setMdp] = useState('');
  const [adresse, setAdresse] = useState('');
  const [langue, setLangue] = useState('auto');
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setMdp(user?.mdp ?? '');
    setAdresse(user?.adresse ?? '');
    setLangue(user?.languePreferee ?? 'auto');
  }, [user]);

  const onSave = async () => {
    setPending(true);
    try {
      await updateProfile({ mdp, adresse, languePreferee: langue });
      Alert.alert('Succes', 'Profil mis a jour');
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Impossible de sauvegarder');
    } finally {
      setPending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compte</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nom</Text>
        <TextInput style={[styles.input, styles.inputDisabled]} value={user?.nom ?? ''} editable={false} />

        <Text style={styles.label}>Mot de passe</Text>
        <TextInput style={styles.input} value={mdp} onChangeText={setMdp} secureTextEntry />

        <Text style={styles.label}>Adresse</Text>
        <TextInput style={styles.input} value={adresse} onChangeText={setAdresse} />

        <Text style={styles.label}>Langue</Text>
        <View style={styles.radiosWrap}>
          {LANGUES.map((item) => (
            <RadioOption
              key={item.key}
              label={item.label}
              active={langue === item.key}
              onPress={() => setLangue(item.key)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={onSave} disabled={pending}>
          <Text style={styles.saveText}>{pending ? 'Enregistrement...' : 'Enregistrer'}</Text>
        </TouchableOpacity>

        <Pressable style={styles.linkWrap} onPress={() => router.push('/(client)/compte/entrepots')}>
          <Text style={styles.linkText}>Entrepot</Text>
        </Pressable>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Se deconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  label: {
    marginTop: 8,
    color: '#64748b',
  },
  input: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: '#0f172a',
  },
  inputDisabled: {
    backgroundColor: '#e2e8f0',
    color: '#334155',
  },
  radiosWrap: {
    marginTop: 6,
    flexDirection: 'row',
    gap: 14,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#64748b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: '#0f766e',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0f766e',
  },
  radioLabel: {
    marginLeft: 6,
    color: '#0f172a',
    fontWeight: '600',
  },
  saveBtn: {
    marginTop: 14,
    backgroundColor: '#0f766e',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
  },
  linkWrap: {
    marginTop: 14,
    alignSelf: 'flex-start',
  },
  linkText: {
    color: '#0f766e',
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
  logoutBtn: {
    marginTop: 18,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
  },
});
