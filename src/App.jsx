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
import Navbar from './components/Navbar';
import UserProfile from './components/UserProfile';

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
        `https://superheroapi.com/api.php/${import.meta.env.VITE_SUPERHERO_API_KEY}/search/${query}`
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
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <Navigation />
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-8 border-white border-t-transparent"></div>
          </div>
        }>
          <div className="app-container">
            <UserProfile />
            <Navbar
              favorites={favorites}
              unlockedHeroes={unlockedHeroes}
              setShowFavorites={setShowFavorites}
              setShowCollection={setShowCollection}
              setShowingHome={setShowingHome}
            />

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

            <AnimatePresence>
              {selectedHero && (
                <HeroDetails hero={selectedHero} onClose={() => setSelectedHero(null)} />
              )}

              {showGuessHero && (
                <GuessHero 
                  onClose={() => setShowGuessHero(false)} 
                  onUnlock={addToCollection}
                />
              )}

              {showBattle && (
                <BattleArena onClose={() => setShowBattle(false)} />
              )}

              {showPersonalityQuiz && (
                <PersonalityQuiz 
                  onClose={() => setShowPersonalityQuiz(false)} 
                  onHeroMatch={(hero) => {
                    setSelectedHero(hero);
                    setShowPersonalityQuiz(false);
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </Suspense>
      </div>
    </AuthProvider>
  );
}

export default App;