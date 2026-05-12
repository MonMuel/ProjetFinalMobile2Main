import { useMemo } from 'react';
import { getLocales } from 'expo-localization';
import { useAuth } from './AuthContext';

const TRANSLATIONS = {
  fr: {
    common_user: 'Usager',
    common_language: 'Langue',
    common_theme: 'Theme',
    common_dark: 'Sombre',
    common_light: 'Clair',
    common_toggle_theme: 'Changer theme',
    common_logout: 'Deconnexion',
    common_auto: 'Auto',
    common_french: 'Francais',
    common_english: 'English',
    common_save: 'Enregistrer',
    common_close: 'Fermer',
    common_loading: 'Initialisation...',
    tabs_products: 'Produits',
    tabs_cart: 'Panier',
    tabs_account: 'Compte',
    login_connect: 'Se connecter',
    login_connecting: 'Connexion...',
    login_name_placeholder: 'Nom',
    login_password_placeholder: 'Mot de passe',
    login_hint: 'Demo: Admin / 1234 ou Client Test / 1234',
    login_error_generic: 'Une erreur est survenue',
    cart_title: 'Votre panier',
    cart_empty: 'Le panier est vide.',
    cart_unit_price: 'Prix unitaire: {price}',
    cart_product_total: 'Total produit: {price}',
    cart_quantity: 'Quantite: {qty}',
    cart_items: 'Articles: {count}',
    cart_total: 'Total: {price}',
    cart_clear: 'Vider panier',
    cart_buy: 'Acheter',
    cart_confirmed: 'Achat confirme',
    cart_thanks: 'Merci pour votre commande.',
    cart_items_count: "Nombre d'articles: {count}",
    cart_total_paid: 'Total paye: {price}',
    product_details_title: 'Details du produit',
    product_no_description: 'Aucune description disponible.',
    product_add: 'Ajouter au panier',
    product_add_again: 'Ajouter a nouveau',
    product_alert_title: 'Panier',
    product_alert_added: '"{name}" ajoute au panier.',
    account_title: 'Compte',
    account_name: 'Nom',
    account_password: 'Mot de passe',
    account_address: 'Adresse',
    account_language: 'Langue',
    account_saved_title: 'Succes',
    account_saved_message: 'Profil mis a jour',
    account_error_title: 'Erreur',
    account_error_message: 'Impossible de sauvegarder',
    account_saving: 'Enregistrement...',
    account_warehouse: 'Entrepot',
    admin_title: 'Espace administrateur',
    admin_subtitle: 'Gestion des produits: ajout, suppression et liste',
    admin_validation_title: 'Validation',
    admin_name_price_required: 'Nom et prix sont obligatoires',
    admin_price_positive: 'Le prix doit etre un nombre positif',
    admin_delete_title: 'Suppression',
    admin_delete_question: 'Voulez-vous supprimer ce produit ?',
    admin_cancel: 'Annuler',
    admin_delete: 'Supprimer',
    admin_add_product: 'Ajouter produit',
    admin_product_name_placeholder: 'Nom du produit',
    admin_product_desc_placeholder: 'Description du produit',
    admin_product_price_placeholder: 'Prix (ex: 199.99)',
    admin_product_image_placeholder: 'URL image (optionnel)',
    warehouses_title: 'Entrepots',
    warehouses_nearest: 'Plus proche: {name}',
    warehouses_path_points: 'Chemin trace depuis le JSON ({count} points)',
  },
  en: {
    common_user: 'User',
    common_language: 'Language',
    common_theme: 'Theme',
    common_dark: 'Dark',
    common_light: 'Light',
    common_toggle_theme: 'Switch theme',
    common_logout: 'Logout',
    common_auto: 'Auto',
    common_french: 'French',
    common_english: 'English',
    common_save: 'Save',
    common_close: 'Close',
    common_loading: 'Initializing...',
    tabs_products: 'Products',
    tabs_cart: 'Cart',
    tabs_account: 'Account',
    login_connect: 'Sign in',
    login_connecting: 'Signing in...',
    login_name_placeholder: 'Username',
    login_password_placeholder: 'Password',
    login_hint: 'Demo: Admin / 1234 or Client Test / 1234',
    login_error_generic: 'An error occurred',
    cart_title: 'Your cart',
    cart_empty: 'Your cart is empty.',
    cart_unit_price: 'Unit price: {price}',
    cart_product_total: 'Item total: {price}',
    cart_quantity: 'Quantity: {qty}',
    cart_items: 'Items: {count}',
    cart_total: 'Total: {price}',
    cart_clear: 'Clear cart',
    cart_buy: 'Buy',
    cart_confirmed: 'Purchase confirmed',
    cart_thanks: 'Thank you for your order.',
    cart_items_count: 'Number of items: {count}',
    cart_total_paid: 'Total paid: {price}',
    product_details_title: 'Product details',
    product_no_description: 'No description available.',
    product_add: 'Add to cart',
    product_add_again: 'Add again',
    product_alert_title: 'Cart',
    product_alert_added: '"{name}" added to cart.',
    account_title: 'Account',
    account_name: 'Name',
    account_password: 'Password',
    account_address: 'Address',
    account_language: 'Language',
    account_saved_title: 'Success',
    account_saved_message: 'Profile updated',
    account_error_title: 'Error',
    account_error_message: 'Unable to save profile',
    account_saving: 'Saving...',
    account_warehouse: 'Warehouse',
    admin_title: 'Admin area',
    admin_subtitle: 'Product management: add, delete, and list',
    admin_validation_title: 'Validation',
    admin_name_price_required: 'Name and price are required',
    admin_price_positive: 'Price must be a positive number',
    admin_delete_title: 'Delete',
    admin_delete_question: 'Do you want to delete this product?',
    admin_cancel: 'Cancel',
    admin_delete: 'Delete',
    admin_add_product: 'Add product',
    admin_product_name_placeholder: 'Product name',
    admin_product_desc_placeholder: 'Product description',
    admin_product_price_placeholder: 'Price (e.g. 199.99)',
    admin_product_image_placeholder: 'Image URL (optional)',
    warehouses_title: 'Warehouses',
    warehouses_nearest: 'Nearest: {name}',
    warehouses_path_points: 'Path traced from JSON ({count} points)',
  },
};

function getDeviceLocale() {
  try {
    const locales = getLocales();
    if (Array.isArray(locales) && locales.length > 0 && locales[0]?.languageTag) {
      return locales[0].languageTag;
    }

    return Intl.DateTimeFormat().resolvedOptions().locale || 'fr-CA';
  } catch (_error) {
    return 'fr-CA';
  }
}

function normalizeLanguage(localeOrCode) {
  const value = String(localeOrCode || '').toLowerCase();
  if (value.startsWith('fr')) {
    return 'fr';
  }
  return 'en';
}

function getLocaleFromPreference(preference) {
  if (!preference || preference === 'auto') {
    return getDeviceLocale();
  }
  if (preference === 'fr') {
    return 'fr-CA';
  }
  if (preference === 'en') {
    return 'en-CA';
  }
  return getDeviceLocale();
}

function interpolate(template, variables) {
  if (!variables) {
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (_, key) => String(variables[key] ?? `{${key}}`));
}

export function useI18n() {
  const { user } = useAuth();
  const locale = useMemo(
    () => getLocaleFromPreference(user?.languePreferee ?? 'auto'),
    [user?.languePreferee]
  );
  const language = useMemo(() => normalizeLanguage(locale), [locale]);
  const dictionary = TRANSLATIONS[language] || TRANSLATIONS.fr;

  const t = (key, variables) => {
    const template = dictionary[key] || TRANSLATIONS.fr[key] || key;
    return interpolate(template, variables);
  };

  const formatPrice = (value) => {
    const amount = Number(value) || 0;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const languageLabel = (value) => {
    if (value === 'fr') {
      return t('common_french');
    }
    if (value === 'en') {
      return t('common_english');
    }
    return t('common_auto');
  };

  return {
    locale,
    language,
    t,
    formatPrice,
    languageLabel,
  };
}

