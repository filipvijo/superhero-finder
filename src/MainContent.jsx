import { motion } from 'framer-motion';

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
  setShowPersonalityQuiz
}) => {
  return (
    <div className="min-h-screen bg-[url('/background.jpg')] bg-cover bg-center bg-fixed">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bangers text-white filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] mb-4" 
              style={{ letterSpacing: '2px' }}>
            SUPERHERO FINDER
          </h1>
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for a superhero..."
                className="w-full px-6 py-3 rounded-lg text-xl font-bangers bg-white/90 border-4 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                style={{ letterSpacing: '1px' }}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-black px-6 py-2 rounded-lg font-bangers border-2 border-black hover:bg-yellow-500 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                style={{ letterSpacing: '1px' }}
              >
                SEARCH!
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
            GUESS THE HERO!
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBattle(true)}
            className="px-6 py-3 bg-red-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
            style={{ letterSpacing: '1px' }}
          >
            BATTLE ARENA!
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPersonalityQuiz(true)}
            className="px-6 py-3 bg-blue-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
            style={{ letterSpacing: '1px' }}
          >
            FIND YOUR MATCH!
          </motion.button>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-8 border-yellow-400 border-t-transparent"></div>
            <p className="mt-4 text-2xl font-bangers text-yellow-400 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" style={{ letterSpacing: '1px' }}>
              SEARCHING THE MULTIVERSE...
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
        {!loading && !error && heroes.length > 0 && (
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-8">
              {heroes.map((hero) => (
                <motion.div
                  key={hero.id}
                  layoutId={`hero-${hero.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative bg-white rounded-lg overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer transform transition-all hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
                  onClick={() => handleSelectHero(hero)}
                >
                  <div className="relative h-64">
                    <img
                      src={hero.image.url}
                      alt={hero.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(hero);
                      }}
                      className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center bg-white rounded-full border-2 border-black font-bangers text-xl hover:bg-yellow-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      {favorites.some(f => f.id === hero.id) ? '★' : '☆'}
                    </button>
                  </div>
                  <div className="p-4 bg-gradient-to-b from-white to-gray-100">
                    <h3 className="text-xl font-bangers text-center mb-2" style={{ letterSpacing: '1px' }}>{hero.name}</h3>
                    <div className="text-sm space-y-1 font-bold">
                      <p className="flex justify-between">
                        <span className="text-gray-600">PUBLISHER:</span>
                        <span>{hero.biography.publisher || 'Unknown'}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-600">ALIGNMENT:</span>
                        <span>{hero.biography.alignment || 'Unknown'}</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;