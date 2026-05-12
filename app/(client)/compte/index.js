import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../Data/AuthContext';
import { useI18n } from '../../../Data/traduction';
import { useTheme } from '../../../Data/ThemeContext';

function RadioOption({ label, active, onPress, styles }) {
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
  const { t, languageLabel } = useI18n();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [mdp, setMdp] = useState('');
  const [adresse, setAdresse] = useState('');
  const [langue, setLangue] = useState('auto');
  const [pending, setPending] = useState(false);

  const LANGUES = [
    { key: 'fr', label: languageLabel('fr') },
    { key: 'en', label: languageLabel('en') },
    { key: 'auto', label: languageLabel('auto') },
  ];

  useEffect(() => {
    setMdp(user?.mdp ?? '');
    setAdresse(user?.adresse ?? '');
    setLangue(user?.languePreferee ?? 'auto');
  }, [user]);

  const onSave = async () => {
    setPending(true);
    try {
      await updateProfile({ mdp, adresse, languePreferee: langue });
      Alert.alert(t('account_saved_title'), t('account_saved_message'));
    } catch (error) {
      Alert.alert(t('account_error_title'), error.message || t('account_error_message'));
    } finally {
      setPending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('account_title')}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>{t('account_name')}</Text>
        <TextInput style={[styles.input, styles.inputDisabled]} value={user?.nom ?? ''} editable={false} />

        <Text style={styles.label}>{t('account_password')}</Text>
        <TextInput style={styles.input} value={mdp} onChangeText={setMdp} secureTextEntry />

        <Text style={styles.label}>{t('account_address')}</Text>
        <TextInput style={styles.input} value={adresse} onChangeText={setAdresse} />

        <Text style={styles.label}>{t('account_language')}</Text>
        <View style={styles.radiosWrap}>
          {LANGUES.map((item) => (
            <RadioOption
              key={item.key}
              label={item.label}
              active={langue === item.key}
              onPress={() => setLangue(item.key)}
              styles={styles}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={onSave} disabled={pending}>
          <Text style={styles.saveText}>{pending ? t('account_saving') : t('common_save')}</Text>
        </TouchableOpacity>

        <Pressable style={styles.linkWrap} onPress={() => router.push('/(client)/compte/entrepots')}>
          <Text style={styles.linkText}>{t('account_warehouse')}</Text>
        </Pressable>
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => {
          logout();
        }}
      >
        <Text style={styles.logoutText}>{t('common_logout')}</Text>
      </TouchableOpacity>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 14,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 12,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
      elevation: 4,
      shadowColor: '#000080',
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    label: {
      marginTop: 8,
      color: colors.textSoft,
    },
    input: {
      marginTop: 4,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: colors.surfaceAlt,
      color: colors.text,
    },
    inputDisabled: {
      backgroundColor: colors.surfaceAlt,
      color: colors.textSoft,
      opacity: 0.7,
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
      borderColor: colors.textSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioOuterActive: {
      borderColor: colors.primary,
    },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
    },
    radioLabel: {
      marginLeft: 6,
      color: colors.text,
      fontWeight: '600',
    },
    saveBtn: {
      marginTop: 14,
      backgroundColor: colors.primary,
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
      color: colors.textSoft,
      textDecorationLine: 'underline',
      fontWeight: '700',
    },
    logoutBtn: {
      marginTop: 18,
      backgroundColor: colors.surfaceAlt,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    logoutText: {
      color: colors.text,
      fontWeight: '700',
    },
  });
}

