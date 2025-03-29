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

const MainContent = lazy(() => import('./MainContent'));

function App() {
  const [query, setQuery] = useState('');
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedHero, setSelectedHero] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [unlockedHeroes, setUnlockedHeroes] = useState(() => {
    const saved = localStorage.getItem('unlockedHeroes');
    return saved ? JSON.parse(saved) : [];
  });
  const [showGuessHero, setShowGuessHero] = useState(false);
  const [showBattle, setShowBattle] = useState(false);
  const [showPersonalityQuiz, setShowPersonalityQuiz] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [showingHome, setShowingHome] = useState(true);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('unlockedHeroes', JSON.stringify(unlockedHeroes));
  }, [unlockedHeroes]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://superheroapi.com/api/${import.meta.env.VITE_SUPERHERO_API_KEY}/search/${query}`
      );

      if (response.data.response === 'success') {
        setHeroes(response.data.results);
      } else {
        setError('No heroes found. Try another search.');
        setHeroes([]);
      }
    } catch (err) {
      console.error('Error fetching heroes:', err);
      setError('Failed to fetch heroes. Please try again.');
      setHeroes([]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const toggleFavorite = (hero) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(f => f.id === hero.id);
      if (isFavorite) {
        return prevFavorites.filter(f => f.id !== hero.id);
      } else {
        return [...prevFavorites, hero];
      }
    });
  };

  const addToCollection = (hero) => {
    setUnlockedHeroes(prev => {
      if (!prev.some(h => h.id === hero.id)) {
        return [...prev, hero];
      }
      return prev;
    });
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
              />
            )}
            {showPersonalityQuiz && (
              <PersonalityQuiz
                onClose={() => setShowPersonalityQuiz(false)}
                addToCollection={addToCollection}
              />
            )}
          </AnimatePresence>
        </div>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;