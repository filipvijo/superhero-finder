import { motion } from 'framer-motion';
import HeroCard from './components/HeroCard';
import { useTranslation } from 'react-i18next';

const MainContent = ({
  query,
  setQuery,
  heroes,
  loading,
  error,
  handleSearch,
  handleKeyPress,
  handleSelectHero,
  toggleFavorite,
  favorites,
  setShowGuessHero,
  setShowBattle,
  setShowPersonalityQuiz,
  showingHome,
  showFavorites,
  showCollection,
  setShowingHome
}) => {
  const { t } = useTranslation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowingHome(true);
    handleSearch(e);
  };
  
  return (
    <div className="min-h-screen bg-[url('/background.jpg')] bg-cover bg-center bg-fixed pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bangers text-white filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] mb-4" 
              style={{ letterSpacing: '2px' }}>
            SUPERHERO FINDER
          </h1>
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('searchHero')}
                className="w-full px-6 py-3 rounded-lg text-xl font-bangers bg-white/90 border-4 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                style={{ letterSpacing: '1px' }}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-black px-6 py-2 rounded-lg font-bangers border-2 border-black hover:bg-yellow-500 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                style={{ letterSpacing: '1px' }}
              >
                {t('search')}
              </button>
            </form>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGuessHero(true)}
            className="px-6 py-3 bg-purple-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
            style={{ letterSpacing: '1px' }}
          >
            {t('guessHero')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBattle(true)}
            className="px-6 py-3 bg-red-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
            style={{ letterSpacing: '1px' }}
          >
            {t('battleArena')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPersonalityQuiz(true)}
            className="px-6 py-3 bg-blue-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
            style={{ letterSpacing: '1px' }}
          >
            {t('findMatch')}
          </motion.button>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-8 border-yellow-400 border-t-transparent"></div>
            <p className="mt-4 text-2xl font-bangers text-yellow-400 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" style={{ letterSpacing: '1px' }}>
              {t('searching')}
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-2xl font-bangers text-red-500 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" style={{ letterSpacing: '1px' }}>
              {error}
            </p>
          </div>
        )}

        {/* Hero Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {heroes.map((hero) => (
            <HeroCard
              key={hero.id}
              hero={hero}
              onSelect={handleSelectHero}
              isFavorite={favorites.some((f) => f.id === hero.id)}
              onToggleFavorite={() => toggleFavorite(hero)}
            />
          ))}
        </div>

        {/* No Results Message */}
        {!loading && !error && heroes.length === 0 && showingHome && (
          <div className="text-center py-8">
            <p className="text-2xl font-bangers text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" style={{ letterSpacing: '1px' }}>
              {t('noHeroes')}
            </p>
          </div>
        )}

        {/* Empty Favorites Message */}
        {!loading && !error && heroes.length === 0 && showFavorites && (
          <div className="text-center py-8">
            <p className="text-2xl font-bangers text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" style={{ letterSpacing: '1px' }}>
              {t('noFavorites')}
            </p>
          </div>
        )}

        {/* Empty Collection Message */}
        {!loading && !error && heroes.length === 0 && showCollection && (
          <div className="text-center py-8">
            <p className="text-2xl font-bangers text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" style={{ letterSpacing: '1px' }}>
              {t('noCollection')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;