import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { migrateDB } from './BD';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [db, setDb] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const database = await SQLite.openDatabaseAsync('projetfinalmobile2.db');
        await migrateDB(database);
        if (mounted) {
          setDb(database);
        }
      } catch (error) {
        console.error('Erreur initialisation DB:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (nom, mdp) => {
    if (!db) {
      return { success: false, message: 'Base de donnees non prete' };
    }

    const cleanNom = nom?.trim();
    if (!cleanNom || !mdp) {
      return { success: false, message: 'Nom et mot de passe requis' };
    }

    const existingUser = await db.getFirstAsync(
      'SELECT nom, mdp, admin, adresse, langue_preferee FROM Client WHERE nom = ? AND mdp = ? LIMIT 1;',
      [cleanNom, mdp]
    );

    if (!existingUser) {
      return { success: false, message: 'Identifiants invalides' };
    }

    const normalized = {
      nom: existingUser.nom,
      mdp: existingUser.mdp,
      admin: existingUser.admin === 1,
      adresse: existingUser.adresse,
      languePreferee: existingUser.langue_preferee,
    };
    setUser(normalized);

    return { success: true, user: normalized };
  }, [db]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback(async ({ mdp, adresse, languePreferee }) => {
    if (!db || !user) {
      throw new Error('Utilisateur non connecte');
    }

    const nextMdp = mdp?.trim();
    const nextAdresse = adresse?.trim() ?? '';
    const nextLangue = languePreferee?.trim() || 'auto';

    if (!nextMdp) {
      throw new Error('Mot de passe requis');
    }

    await db.runAsync(
      'UPDATE Client SET mdp = ?, adresse = ?, langue_preferee = ? WHERE nom = ?;',
      [nextMdp, nextAdresse, nextLangue, user.nom]
    );

    setUser((prev) => ({
      ...prev,
      mdp: nextMdp,
      adresse: nextAdresse,
      languePreferee: nextLangue,
    }));
  }, [db, user]);

  const getProduits = useCallback(async () => {
    if (!db) {
      return [];
    }
    const rows = await db.getAllAsync('SELECT id, nom, description, prix, image FROM Produit ORDER BY id DESC;');
    return rows ?? [];
  }, [db]);

  const ajouterProduit = useCallback(async ({ nom, description, prix, image }) => {
    if (!db) {
      throw new Error('Base de donnees non prete');
    }
    await db.runAsync(
      'INSERT INTO Produit (nom, description, prix, image) VALUES (?, ?, ?, ?);',
      [nom.trim(), description?.trim() ?? '', Number(prix), image?.trim() ?? 'https://via.placeholder.com/150']
    );
  }, [db]);

  const supprimerProduit = useCallback(async (id) => {
    if (!db) {
      throw new Error('Base de donnees non prete');
    }
    await db.runAsync('DELETE FROM Produit WHERE id = ?;', [id]);
  }, [db]);

  const value = useMemo(() => ({
    isLoading,
    user,
    login,
    logout,
    updateProfile,
    getProduits,
    ajouterProduit,
    supprimerProduit,
  }), [isLoading, user, login, logout, updateProfile, getProduits, ajouterProduit, supprimerProduit]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit etre utilise dans AuthProvider');
  }
  return context;
}

