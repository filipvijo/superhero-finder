import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import './i18n';
import './App.css';
import HeroDetails from './HeroDetails';
import GuessHero from './components/GuessHero';
import BattleArena from './components/BattleArena';
import PersonalityQuiz from './components/PersonalityQuiz';
import UserProfile from './components/UserProfile';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import CombatJournal from './components/CombatJournal';
import Collection from './components/Collection';

const MainContent = lazy(() => import('./MainContent'));

// Custom Hook for Favorites
function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (hero) => {
    console.log('Toggling favorite for:', hero.name);
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(f => f.id === hero.id);
      if (isFavorite) {
        return prevFavorites.filter(f => f.id !== hero.id);
      } else {
        return [...prevFavorites, hero];
      }
    });
  };

  return [favorites, toggleFavorite];
}

// Custom Hook for Unlocked Heroes (Collection)
function useUnlockedHeroes() {
  const [unlockedHeroes, setUnlockedHeroes] = useState(() => {
    const saved = localStorage.getItem('unlockedHeroes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('unlockedHeroes', JSON.stringify(unlockedHeroes));
  }, [unlockedHeroes]);

  const addToCollection = (hero, source = 'unknown') => {
    console.log('Adding to collection:', hero.name, 'from source:', source);
    setUnlockedHeroes(prev => {
      if (!prev.some(h => h.id === hero.id)) {
        // Add the hero with source information
        const heroWithSource = {
          ...hero,
          source: source // Track where this hero came from
        };
        return [...prev, heroWithSource];
      }
      return prev;
    });
  };

  return [unlockedHeroes, addToCollection];
}

function App() {
  const [query, setQuery] = useState('');
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedHero, setSelectedHero] = useState(null);
  const [favorites, toggleFavorite] = useFavorites();
  const [unlockedHeroes, addToCollection] = useUnlockedHeroes();
  const [showGuessHero, setShowGuessHero] = useState(false);
  const [showBattle, setShowBattle] = useState(false);
  const [showPersonalityQuiz, setShowPersonalityQuiz] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [showingHome, setShowingHome] = useState(true);
  const [showCombatJournal, setShowCombatJournal] = useState(false); // Add this state

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/search?query=${encodeURIComponent(query)}`);

      if (response.data.response === 'success') {
        if (response.data.results) {
          setHeroes(response.data.results);
        } else {
          setError(i18n.t('noHeroes'));
          setHeroes([]);
        }
      } else {
        console.error('API returned an error:', response.data); // Log the API error
        setError(i18n.t('searchError'));
        setHeroes([]);
      }
    } catch (err) {
      console.error('Error fetching heroes:', err); // Log the network or other error
      setError(i18n.t('searchError'));
      setHeroes([]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const displayedHeroes = showFavorites
    ? favorites
    : showCollection
    ? unlockedHeroes
    : heroes;

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <div className="min-h-screen bg-[url('/background.jpg')] bg-cover bg-center bg-fixed">
          <Navigation
            showingHome={showingHome}
            setShowingHome={setShowingHome}
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
            showCollection={showCollection}
            setShowCollection={setShowCollection}
            setShowCombatJournal={setShowCombatJournal} // Pass the setter to Navigation
          />
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-16 w-16 border-8 border-white border-t-transparent"></div>
            </div>
          }>
            <div className="app-container">
              <UserProfile />
              <MainContent
                query={query}
                setQuery={setQuery}
                heroes={displayedHeroes}
                loading={loading}
                error={error}
                handleSearch={handleSearch}
                handleKeyPress={handleKeyPress}
                handleSelectHero={setSelectedHero}
                toggleFavorite={toggleFavorite}
                favorites={favorites}
                setShowGuessHero={setShowGuessHero}
                setShowBattle={setShowBattle}
                setShowPersonalityQuiz={setShowPersonalityQuiz}
                showingHome={showingHome}
                showFavorites={showFavorites}
                showCollection={showCollection}
                setShowingHome={setShowingHome}
              />
            </div>
          </Suspense>

          <AnimatePresence>
            {selectedHero && (
              <HeroDetails
                hero={selectedHero}
                onClose={() => setSelectedHero(null)}
                isFavorite={favorites.some(f => f.id === selectedHero.id)}
                toggleFavorite={toggleFavorite}
                isUnlocked={unlockedHeroes.some(h => h.id === selectedHero.id)}
                addToCollection={addToCollection}
              />
            )}
            {showGuessHero && (
              <GuessHero
                onClose={() => setShowGuessHero(false)}
                addToCollection={addToCollection}
              />
            )}
            {showBattle && (
              <BattleArena
                onClose={() => setShowBattle(false)}
                addToCollection={addToCollection}
                heroes={heroes}
              />
            )}
            {showPersonalityQuiz && (
              <PersonalityQuiz
                onClose={() => setShowPersonalityQuiz(false)}
                addToCollection={addToCollection}
              />
            )}
            {showCombatJournal && (
              <CombatJournal onClose={() => setShowCombatJournal(false)} />
            )}
            {showCollection && (
              <Collection
                unlockedHeroes={unlockedHeroes}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                onClose={() => setShowCollection(false)}
                theme="light"
              />
            )}
          </AnimatePresence>
        </div>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;