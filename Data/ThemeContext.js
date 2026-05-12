import React, { createContext, useContext, useMemo, useState } from 'react';

const THEMES = {
  dark: {
    mode: 'dark',
    colors: {
      background: '#0D1B2A',
      backgroundSoft: '#0B1220',
      surface: '#1A2A3A',
      surfaceAlt: '#0F1823',
      text: '#FFFFFF',
      textMuted: '#DCEBFF',
      textSoft: '#7DBBFF',
      primary: '#0080FF',
      primaryStrong: '#1E40AF',
      border: '#0080FF',
      borderSoft: '#1F2A3D',
      danger: '#B91C1C',
      dangerText: '#F87171',
      dangerSoft: '#2A1620',
      tabActive: '#0f766e',
      tabInactive: '#64748b',
      headerTitle: '#F8FAFC',
      mapContainer: '#0f172a',
      mapCard: '#1e293b',
      mapText: '#cbd5e1',
      mapCaption: '#e2e8f0',
    },
  },
  light: {
    mode: 'light',
    colors: {
      background: '#F3F7FB',
      backgroundSoft: '#E9EFF6',
      surface: '#FFFFFF',
      surfaceAlt: '#F6FAFF',
      text: '#0B1220',
      textMuted: '#334155',
      textSoft: '#1D4ED8',
      primary: '#2563EB',
      primaryStrong: '#1D4ED8',
      border: '#BFDBFE',
      borderSoft: '#CBD5E1',
      danger: '#DC2626',
      dangerText: '#B91C1C',
      dangerSoft: '#FEE2E2',
      tabActive: '#0f766e',
      tabInactive: '#64748b',
      headerTitle: '#0B1220',
      mapContainer: '#E2E8F0',
      mapCard: '#FFFFFF',
      mapText: '#334155',
      mapCaption: '#0F172A',
    },
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('dark');

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = useMemo(() => {
    const theme = THEMES[mode] || THEMES.dark;
    return {
      mode: theme.mode,
      isDark: theme.mode === 'dark',
      colors: theme.colors,
      toggleTheme,
      setThemeMode: setMode,
    };
  }, [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit etre utilise dans ThemeProvider');
  }
  return context;
}

