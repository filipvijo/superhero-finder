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
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col items-center justify-center mb-8">
          <h1 className="text-6xl font-bangers mb-8 text-center text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            SUPERHERO FINDER
          </h1>
          <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 relative">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('searchHero')}
                className="flex-1 px-6 py-3 rounded-lg text-xl font-bangers bg-white/90 border-4 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                style={{ letterSpacing: '1px' }}
                enterKeyHint="search"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-yellow-400 text-black text-xl font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all whitespace-nowrap"
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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-8 border-white border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-bold">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {heroes.map((hero) => (
              <motion.div
                key={hero.id}
                layoutId={`hero-${hero.id}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectHero(hero)}
                className="bg-black/80 backdrop-blur-sm rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden cursor-pointer group relative"
              >
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(hero);
                  }}
                  className="absolute top-2 right-2 z-10 p-1 text-2xl bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  {favorites.some(f => f.id === hero.id) ? '⭐' : '☆'}
                </motion.button>
                <div className="relative aspect-[2/3]">
                  <img
                    src={hero.image?.url || '/placeholder.jpg'}
                    alt={hero.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/90 transition-all" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bangers text-white mb-1" style={{ letterSpacing: '1px' }}>
                      {hero.name}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {hero.biography?.publisher || t('unknownPublisher')}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {!loading && !error && heroes.length === 0 && showingHome && (
          <div className="text-center mt-8">
            <p className="text-2xl font-bangers text-white filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" style={{ letterSpacing: '1px' }}>
              {t('searchMessage')}
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