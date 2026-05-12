import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../Data/AuthContext';
import { useI18n } from '../../Data/traduction';
import { useTheme } from '../../Data/ThemeContext';

export default function UserHeader() {
  const { user, logout } = useAuth();
  const { t, languageLabel } = useI18n();
  const { isDark, colors, toggleTheme } = useTheme();
  const styles = createStyles(colors);

  if (!user) {
    return null;
  }

  const themeLabel = isDark ? t('common_dark') : t('common_light');

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
          <Text style={styles.langText}>{t('common_theme')}: {themeLabel}</Text>
        </View>

        <View style={styles.actionsCol}>
          <Pressable onPress={toggleTheme} style={styles.themeBtn}>
            <MaterialCommunityIcons
              name={isDark ? 'white-balance-sunny' : 'weather-night'}
              size={14}
              color={colors.text}
            />
            <Text style={styles.themeText}>{t('common_toggle_theme')}</Text>
          </Pressable>

          <Pressable onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>{t('common_logout')}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    safeArea: {
      backgroundColor: colors.backgroundSoft,
    },
    container: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      backgroundColor: colors.backgroundSoft,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderSoft,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    infoWrap: {
      flexShrink: 1,
    },
    nameText: {
      color: colors.headerTitle,
      fontWeight: '700',
      fontSize: 14,
    },
    langText: {
      marginTop: 2,
      color: colors.textMuted,
      fontSize: 13,
    },
    actionsCol: {
      alignItems: 'flex-end',
      gap: 6,
    },
    themeBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: colors.surface,
      borderRadius: 8,
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    themeText: {
      color: colors.text,
      fontWeight: '700',
      fontSize: 11,
    },
    logoutBtn: {
      backgroundColor: colors.danger,
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
}

