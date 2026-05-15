'use client';
import { createContext, useContext, useEffect, useState } from 'react';

export const TRANSLATIONS = {
  en: {
    // Sidebar nav
    nav_dashboard: 'Dashboard',
    nav_send: 'Send Money',
    nav_transfers: 'Transfers',
    nav_kyc: 'KYC',
    nav_beneficiaries: 'Beneficiaries',
    nav_rates: 'Rates',
    nav_profile: 'Profile',
    nav_clients: 'Clients',
    nav_commissions: 'Commissions',
    nav_float: 'Float',
    nav_users: 'Users',
    nav_fraud: 'Fraud',
    nav_aml: 'AML',
    nav_flagged: 'Flagged',
    nav_analytics: 'Analytics',
    nav_reports: 'Reports',
    nav_audit: 'Audit Log',
    nav_config: 'Config',
    nav_limits: 'Limits',
    nav_overview: 'Overview',
    nav_kyc_review: 'KYC Review',

    // TopBar
    tb_profile: 'Profile',
    tb_settings: 'Settings',
    tb_logout: 'Logout',

    // Dashboard
    dash_welcome: 'Welcome back',
    dash_overview: "Here's your account overview",
    dash_wallet: 'Wallet Balance',
    dash_completed: 'Completed',
    dash_pending: 'Pending',
    dash_kyc_status: 'KYC Status',
    dash_recent: 'Recent Transfers',
    dash_view_all: 'View all',
    dash_send_money: 'Send Money',
    dash_kyc_title: 'Complete your KYC verification',
    dash_kyc_desc: 'Verify your identity to unlock higher transfer limits and full platform access.',
    dash_kyc_cta: 'Verify now →',
    dash_no_transfers: 'No transfers yet.',
    dash_send_first: 'Send your first transfer',
    dash_not_started: 'Not Started',

    // Profile
    profile_title: 'My Profile',
    profile_personal: 'Personal Information',
    profile_security: 'Security',
    profile_name: 'Full Name',
    profile_email: 'Email Address',
    profile_phone: 'Phone Number',
    profile_country: 'Country',
    profile_role: 'Role',
    profile_since: 'Member since',
    profile_edit: 'Edit Profile',
    profile_save: 'Save Changes',
    profile_saving: 'Saving…',
    profile_cancel: 'Cancel',
    profile_pw_title: 'Change Password',
    profile_current_pw: 'Current Password',
    profile_new_pw: 'New Password',
    profile_confirm_pw: 'Confirm New Password',
    profile_update_pw: 'Update Password',
    profile_updating_pw: 'Updating…',
    profile_google_pw: 'Password login is not available for Google accounts.',

    // Common
    loading: 'Loading…',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
  },

  fr: {
    // Sidebar nav
    nav_dashboard: 'Tableau de bord',
    nav_send: "Envoyer de l'argent",
    nav_transfers: 'Transferts',
    nav_kyc: 'KYC',
    nav_beneficiaries: 'Bénéficiaires',
    nav_rates: 'Taux de change',
    nav_profile: 'Profil',
    nav_clients: 'Clients',
    nav_commissions: 'Commissions',
    nav_float: 'Float',
    nav_users: 'Utilisateurs',
    nav_fraud: 'Fraude',
    nav_aml: 'LCB-FT',
    nav_flagged: 'Signalés',
    nav_analytics: 'Analytiques',
    nav_reports: 'Rapports',
    nav_audit: 'Journal d\'audit',
    nav_config: 'Configuration',
    nav_limits: 'Limites',
    nav_overview: 'Vue d\'ensemble',
    nav_kyc_review: 'Révision KYC',

    // TopBar
    tb_profile: 'Profil',
    tb_settings: 'Paramètres',
    tb_logout: 'Déconnexion',

    // Dashboard
    dash_welcome: 'Bon retour',
    dash_overview: 'Voici un aperçu de votre compte',
    dash_wallet: 'Solde du portefeuille',
    dash_completed: 'Complétés',
    dash_pending: 'En attente',
    dash_kyc_status: 'Statut KYC',
    dash_recent: 'Transferts récents',
    dash_view_all: 'Voir tout',
    dash_send_money: "Envoyer de l'argent",
    dash_kyc_title: 'Complétez votre vérification KYC',
    dash_kyc_desc: "Vérifiez votre identité pour accéder à des limites de transfert plus élevées et à l'accès complet.",
    dash_kyc_cta: 'Vérifier maintenant →',
    dash_no_transfers: 'Aucun transfert pour le moment.',
    dash_send_first: 'Envoyez votre premier transfert',
    dash_not_started: 'Non commencé',

    // Profile
    profile_title: 'Mon profil',
    profile_personal: 'Informations personnelles',
    profile_security: 'Sécurité',
    profile_name: 'Nom complet',
    profile_email: 'Adresse e-mail',
    profile_phone: 'Numéro de téléphone',
    profile_country: 'Pays',
    profile_role: 'Rôle',
    profile_since: 'Membre depuis',
    profile_edit: 'Modifier le profil',
    profile_save: 'Sauvegarder',
    profile_saving: 'Sauvegarde…',
    profile_cancel: 'Annuler',
    profile_pw_title: 'Changer le mot de passe',
    profile_current_pw: 'Mot de passe actuel',
    profile_new_pw: 'Nouveau mot de passe',
    profile_confirm_pw: 'Confirmer le nouveau mot de passe',
    profile_update_pw: 'Mettre à jour',
    profile_updating_pw: 'Mise à jour…',
    profile_google_pw: 'La connexion par mot de passe n\'est pas disponible pour les comptes Google.',

    // Common
    loading: 'Chargement…',
    save: 'Sauvegarder',
    cancel: 'Annuler',
    close: 'Fermer',
  },
};

const LanguageContext = createContext({ lang: 'en', t: TRANSLATIONS.en, toggleLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('ubuntu-lang');
    if (saved === 'fr' || saved === 'en') setLang(saved);
  }, []);

  const toggleLang = () => {
    setLang(l => {
      const next = l === 'en' ? 'fr' : 'en';
      localStorage.setItem('ubuntu-lang', next);
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, t: TRANSLATIONS[lang], toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
