import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      signIn: 'Sign In',
      logout: 'Logout',
      home: 'HOME',
      favorites: 'FAVORITES',
      collection: 'COLLECTION',

      // Auth Modal
      createAccount: 'Create Account',
      welcomeBack: 'Welcome Back!',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      loading: 'Loading...',
      signUp: 'Sign Up',
      continueWith: 'Or continue with',
      alreadyHaveAccount: 'Already have an account?',
      needAccount: "Need an account?",
      haveAccount: "Already have an account?",
      noAccount: "Don't have an account? Sign up",
      invalidEmail: "Please enter a valid email address",
      passwordTooShort: "Password must be at least 6 characters",
      passwordsDoNotMatch: "Passwords do not match",
      authError: "Authentication error. Please try again.",

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
      generatingBattle: 'Generating Epic Battle',
      usingGPT4oMini: 'Using GPT-4o-mini for enhanced storytelling',
      battleScene: 'Battle Scene',
      fightSceneAlt: 'Epic battle scene',
      winner: 'WINNER',
      newBattle: 'New Battle',
      tryAgain: 'Try Again',
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
      powers: 'Powers',
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

      // Error Messages
      errorGeneratingBattleText: 'Error generating battle narrative. Please try again.',
      errorGeneratingBattleImage: 'Could not generate battle image, but the story is ready!',
      noResultsFound: 'No heroes found with that name.',
      searchError: 'Error searching for heroes. Please try again.',
      apiError: 'API Error',
      networkError: 'Network error. Please check your internet connection and try again.',
      responseFormatError: 'Error processing the response. Please try again.',

      // Game Features
      guessHeroTitle: 'GUESS THE HERO!',
      guessHeroDesc: 'Test your knowledge! Try to guess the superhero based on clues.',
      findMatchTitle: 'FIND YOUR MATCH!',
      findMatchDesc: 'Discover which superhero matches your personality!',
      combatJournalNav: 'BATTLE JOURNAL',
      combatJournalTitle: 'COMBAT JOURNAL',
      battleStory: 'Battle Story',
      sortByDate: 'Sort by Date',
      sortByWinner: 'Sort by Winner',
      sortByHero1: 'Sort by Hero 1',
      sortByHero2: 'Sort by Hero 2',
      allWinners: 'All Winners',
      battleId: 'Battle ID',
      journalEmpty: 'Your Combat Journal is empty. Go battle some heroes!',
      loadingJournal: 'Loading Journal...',
      draw: 'Draw',

      // Guess Hero Game
      attemptsLeft: 'Attempts left',
      enterGuess: 'Enter hero name...',
      guess: 'GUESS',
      correctGuess: 'CORRECT! You unlocked this hero!',
      wrongGuess: 'Wrong! The hero was {{heroName}}',
      playAgain: 'PLAY AGAIN',
      heroAddedToCollection: 'This hero has been added to your collection!',
      unlocked: 'UNLOCKED',
      question: 'Question',

      // Hero Unlock
      heroUnlocked: 'HERO UNLOCKED',
      youUnlockedHero: 'You unlocked a new hero personality!',
      newHero: 'NEW',
      awesome: 'AWESOME',
      yourMatch: 'Your Superhero Match'
    }
  },
  fr: {
    translation: {
      // Navigation
      signIn: 'Connexion',
      logout: 'Déconnexion',
      home: 'ACCUEIL',
      favorites: 'FAVORIS',
      collection: 'COLLECTION',

      // Auth Modal
      createAccount: 'Créer un compte',
      welcomeBack: 'Bon retour!',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      loading: 'Chargement...',
      signUp: "S'inscrire",
      continueWith: 'Ou continuer avec',
      alreadyHaveAccount: 'Déjà un compte?',
      needAccount: "Besoin d'un compte?",
      haveAccount: "Vous avez déjà un compte?",
      noAccount: "Vous n'avez pas de compte? Inscrivez-vous",
      invalidEmail: "Veuillez entrer une adresse email valide",
      passwordTooShort: "Le mot de passe doit comporter au moins 6 caractères",
      passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
      authError: "Erreur d'authentification. Veuillez réessayer.",

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
      generatingBattle: 'Génération d\'un Combat Épique',
      usingGPT4oMini: 'Utilisation de GPT-4o-mini pour une narration améliorée',
      battleScene: 'Scène de Combat',
      fightSceneAlt: 'Scène de combat épique',
      winner: 'VAINQUEUR',
      newBattle: 'Nouveau combat',
      tryAgain: 'Réessayer',
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
      powers: 'Pouvoirs',
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

      // Error Messages
      errorGeneratingBattleText: 'Erreur lors de la génération du récit de bataille. Veuillez réessayer.',
      errorGeneratingBattleImage: 'Impossible de générer l\'image de bataille, mais l\'histoire est prête!',
      noResultsFound: 'Aucun héros trouvé avec ce nom.',
      searchError: 'Erreur lors de la recherche de héros. Veuillez réessayer.',
      apiError: 'Erreur API',
      networkError: 'Erreur de réseau. Veuillez vérifier votre connexion internet et réessayer.',
      responseFormatError: 'Erreur lors du traitement de la réponse. Veuillez réessayer.',

      // Game Features
      guessHeroTitle: 'DEVINE LE HÉROS!',
      guessHeroDesc: 'Testez vos connaissances! Essayez de deviner le super-héros à partir des indices.',
      findMatchTitle: 'TROUVE TON MATCH!',
      findMatchDesc: 'Découvrez quel super-héros correspond à votre personnalité!',
      combatJournalNav: 'JOURNAL DE COMBAT',
      combatJournalTitle: 'JOURNAL DE COMBAT',
      battleStory: 'Histoire de Combat',
      sortByDate: 'Trier par Date',
      sortByWinner: 'Trier par Vainqueur',
      sortByHero1: 'Trier par Héros 1',
      sortByHero2: 'Trier par Héros 2',
      allWinners: 'Tous les Vainqueurs',
      battleId: 'ID de Combat',
      journalEmpty: 'Votre journal de combat est vide. Allez combattre des héros!',
      loadingJournal: 'Chargement du Journal...',
      draw: 'Match Nul',

      // Guess Hero Game
      attemptsLeft: 'Tentatives restantes',
      enterGuess: 'Entrez le nom du héros...',
      guess: 'DEVINER',
      correctGuess: 'CORRECT! Vous avez débloqué ce héros!',
      wrongGuess: 'Faux! Le héros était {{heroName}}',
      playAgain: 'REJOUER',
      heroAddedToCollection: 'Ce héros a été ajouté à votre collection!',
      unlocked: 'DÉBLOQUÉ',
      question: 'Question',

      // Hero Unlock
      heroUnlocked: 'HÉROS DÉBLOQUÉ',
      youUnlockedHero: 'Vous avez débloqué une nouvelle personnalité de héros!',
      newHero: 'NOUVEAU',
      awesome: 'GÉNIAL',
      yourMatch: 'Votre Super-héros Correspondant'
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
