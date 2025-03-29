import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      signIn: 'Sign In',
      logout: 'Logout',
      
      // Auth Modal
      createAccount: 'Create Account',
      welcomeBack: 'Welcome Back!',
      email: 'Email',
      password: 'Password',
      loading: 'Loading...',
      signUp: 'Sign Up',
      continueWith: 'Or continue with',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      
      // Battle Arena
      battleArena: 'Battle Arena',
      searchHero1: 'Search hero 1...',
      searchHero2: 'Search hero 2...',
      search: 'Search',
      startBattle: 'Start Battle!',
      battleInProgress: 'Battle in Progress...',
      newBattle: 'New Battle',
      close: 'Close',
      
      // Media Hub
      didYouKnow: 'Did You Know?',
      firstAppearance: 'First Appearance',
      secretIdentity: 'Secret Identity',
      powerStats: 'Power Stats',
      physicalTraits: 'Physical Traits',
      occupation: 'Occupation',
      connections: 'Connections',
      height: 'Height',
      weight: 'Weight',
      eyeColor: 'Eye Color',
      hairColor: 'Hair Color',
      base: 'Base',
      groupAffiliation: 'Group Affiliation',
      relatives: 'Relatives',
      unknown: 'Unknown',
      unknownOccupation: 'Unknown occupation',
      unknownLocation: 'Unknown location',
      noneKnown: 'None known',
      noKnownAlterEgos: 'no known alter egos',
      strongestAttribute: 'Strongest attribute',
      powerLevel: 'Power Level',
      
      // Movies & Shows
      moviesAndShows: 'Movies & Shows',
      release: 'Release',
      watchOn: 'Watch on',
      buyOn: 'Buy on',
      
      // Comics
      comics: 'Comics',
      publisher: 'Publisher',
      
      // Merchandise
      merchandise: 'Merchandise',
      availableAt: 'Available at',
      shopNow: 'Shop Now',
      
      // Errors
      errorSearchHero: 'Could not find hero:',
      errorTryAgain: 'Failed to search for hero. Please try again.',
      errorSelectHeroes: 'Please select two heroes first!',
      errorGenerateBattle: 'Failed to generate battle. Please try again.',
    }
  },
  fr: {
    translation: {
      // Navigation
      signIn: 'Connexion',
      logout: 'Déconnexion',
      
      // Auth Modal
      createAccount: 'Créer un compte',
      welcomeBack: 'Bon retour!',
      email: 'Email',
      password: 'Mot de passe',
      loading: 'Chargement...',
      signUp: "S'inscrire",
      continueWith: 'Ou continuer avec',
      alreadyHaveAccount: 'Déjà un compte?',
      dontHaveAccount: "Pas encore de compte?",
      
      // Battle Arena
      battleArena: 'Arène de Combat',
      searchHero1: 'Rechercher héros 1...',
      searchHero2: 'Rechercher héros 2...',
      search: 'Rechercher',
      startBattle: 'Commencer le Combat!',
      battleInProgress: 'Combat en Cours...',
      newBattle: 'Nouveau Combat',
      close: 'Fermer',
      
      // Media Hub
      didYouKnow: 'Le Saviez-Vous?',
      firstAppearance: 'Première Apparition',
      secretIdentity: 'Identité Secrète',
      powerStats: 'Statistiques',
      physicalTraits: 'Traits Physiques',
      occupation: 'Occupation',
      connections: 'Connexions',
      height: 'Taille',
      weight: 'Poids',
      eyeColor: 'Couleur des Yeux',
      hairColor: 'Couleur des Cheveux',
      base: 'Base',
      groupAffiliation: "Affiliation",
      relatives: 'Parents',
      unknown: 'Inconnu',
      unknownOccupation: 'Occupation inconnue',
      unknownLocation: 'Lieu inconnu',
      noneKnown: 'Aucun connu',
      noKnownAlterEgos: "pas d'alter ego connu",
      strongestAttribute: 'Attribut le plus fort',
      powerLevel: 'Niveau de Puissance',
      
      // Movies & Shows
      moviesAndShows: 'Films & Séries',
      release: 'Sortie',
      watchOn: 'Regarder sur',
      buyOn: 'Acheter sur',
      
      // Comics
      comics: 'Bandes Dessinées',
      publisher: 'Éditeur',
      
      // Merchandise
      merchandise: 'Produits Dérivés',
      availableAt: 'Disponible chez',
      shopNow: 'Acheter',
      
      // Errors
      errorSearchHero: 'Impossible de trouver le héros:',
      errorTryAgain: 'Échec de la recherche. Veuillez réessayer.',
      errorSelectHeroes: "Veuillez d'abord sélectionner deux héros!",
      errorGenerateBattle: 'Échec de la génération du combat. Veuillez réessayer.',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
