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
      needAccount: "Need an account?",
      
      // Main Content
      searchHero: 'Search for a superhero...',
      search: 'SEARCH!',
      guessHero: 'GUESS THE HERO!',
      battleArena: 'BATTLE ARENA!',
      findMatch: 'FIND YOUR MATCH!',
      searching: 'SEARCHING THE MULTIVERSE...',
      searchMessage: 'Search for your favorite superhero!',
      noHeroes: 'No heroes found. Try another search.',
      searchError: 'Failed to fetch heroes. Please try again.',
      
      // Battle Arena
      searchHero1: 'Search hero 1...',
      searchHero2: 'Search hero 2...',
      startBattle: 'Start Battle!',
      battleInProgress: 'Battle in Progress...',
      newBattle: 'New Battle',
      close: 'Close',
      
      // Hero Details
      biography: 'Biography',
      fullName: 'Full Name',
      alterEgos: 'Alter Egos',
      birthplace: 'Birthplace',
      firstAppearance: 'First Appearance',
      publisher: 'Publisher',
      alignment: 'Alignment',
      
      // Power Stats
      powerStats: 'Power Stats',
      intelligence: 'Intelligence',
      strength: 'Strength',
      speed: 'Speed',
      durability: 'Durability',
      power: 'Power',
      combat: 'Combat',
      
      // Appearance
      appearance: 'Appearance',
      gender: 'Gender',
      race: 'Race',
      height: 'Height',
      weight: 'Weight',
      eyeColor: 'Eye Color',
      hairColor: 'Hair Color',
      
      // Work & Connections
      work: 'Work',
      occupation: 'Occupation',
      base: 'Base',
      connections: 'Connections',
      groupAffiliation: 'Group Affiliation',
      relatives: 'Relatives',
      
      // Common
      unknown: 'Unknown',
      none: 'None',
      noInformation: 'No information available',
      
      // Game Features
      guessHeroTitle: 'GUESS THE HERO!',
      guessHeroDesc: 'Test your knowledge! Try to guess the superhero based on clues.',
      findMatchTitle: 'FIND YOUR MATCH!',
      findMatchDesc: 'Discover which superhero matches your personality!'
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
      needAccount: "Besoin d'un compte?",
      
      // Main Content
      searchHero: 'Rechercher un super-héros...',
      search: 'RECHERCHER!',
      guessHero: 'DEVINE LE HÉROS!',
      battleArena: "L'ARÈNE DE COMBAT!",
      findMatch: 'TROUVE TON MATCH!',
      searching: 'RECHERCHE DANS LE MULTIVERS...',
      searchMessage: 'Rechercher votre super-héros préféré!',
      noHeroes: 'Aucun héros trouvé. Essayez une autre recherche.',
      searchError: 'Échec de la récupération des héros. Veuillez réessayer.',
      
      // Battle Arena
      searchHero1: 'Rechercher héros 1...',
      searchHero2: 'Rechercher héros 2...',
      startBattle: 'Commencer le combat!',
      battleInProgress: 'Combat en cours...',
      newBattle: 'Nouveau combat',
      close: 'Fermer',
      
      // Hero Details
      biography: 'Biographie',
      fullName: 'Nom complet',
      alterEgos: 'Autres identités',
      birthplace: 'Lieu de naissance',
      firstAppearance: 'Première apparition',
      publisher: 'Éditeur',
      alignment: 'Alignement',
      
      // Power Stats
      powerStats: 'Statistiques',
      intelligence: 'Intelligence',
      strength: 'Force',
      speed: 'Vitesse',
      durability: 'Endurance',
      power: 'Puissance',
      combat: 'Combat',
      
      // Appearance
      appearance: 'Apparence',
      gender: 'Genre',
      race: 'Race',
      height: 'Taille',
      weight: 'Poids',
      eyeColor: 'Couleur des yeux',
      hairColor: 'Couleur des cheveux',
      
      // Work & Connections
      work: 'Travail',
      occupation: 'Occupation',
      base: 'Base',
      connections: 'Connexions',
      groupAffiliation: "Affiliation de groupe",
      relatives: 'Parents',
      
      // Common
      unknown: 'Inconnu',
      none: 'Aucun',
      noInformation: 'Aucune information disponible',
      
      // Game Features
      guessHeroTitle: 'DEVINE LE HÉROS!',
      guessHeroDesc: 'Testez vos connaissances! Essayez de deviner le super-héros à partir des indices.',
      findMatchTitle: 'TROUVE TON MATCH!',
      findMatchDesc: 'Découvrez quel super-héros correspond à votre personnalité!'
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
