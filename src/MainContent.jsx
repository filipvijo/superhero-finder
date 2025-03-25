import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Parallax } from "react-parallax";
import { Tilt } from "react-tilt";

function MainContent({
  query,
  setQuery,
  heroes,
  setHeroes,
  publisherFilter,
  setPublisherFilter,
  alignmentFilter,
  setAlignmentFilter,
  selectedHeroes,
  setSelectedHeroes,
  showComparison,
  setShowComparison,
  votes,
  setVotes,
  showPollResults,
  setShowPollResults,
  showQuiz,
  setShowQuiz,
  quizHero,
  setQuizHero,
  quizGuess,
  setQuizGuess,
  quizResult,
  setQuizResult,
  favorites,
  setFavorites,
  showFavorites,
  setShowFavorites,
  showLeaderboard,
  setShowLeaderboard,
  voteHistory,
  setVoteHistory,
  theme,
  toggleTheme,
  fetchSuperheroes,
  handleSelectHero,
  handleCompare,
  handleVote,
  startQuiz,
  handleQuizGuess,
  toggleFavorite,
  resetData,
  loading,
  error,
  setError,
  currentPage,
  setCurrentPage,
  heroesPerPage,
}) {
  const totalVotes = Object.values(votes).reduce((sum, vote) => sum + vote, 0);

  const leaderboard = Object.entries(votes)
    .map(([heroId, voteCount]) => {
      const heroData = voteHistory[heroId];
      return heroData ? { name: heroData.name, votes: voteCount } : null;
    })
    .filter((entry) => entry !== null)
    .sort((a, b) => b.votes - a.votes);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchSuperheroes();
    }
  };

  // Calculate the heroes to display on the current page
  const indexOfLastHero = currentPage * heroesPerPage;
  const indexOfFirstHero = indexOfLastHero - heroesPerPage;
  const currentHeroes = heroes.slice(indexOfFirstHero, indexOfLastHero);

  // Calculate total pages
  const totalPages = Math.ceil(heroes.length / heroesPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`min-h-screen ${theme}`}>
      {/* Parallax Background */}
      <Parallax
        bgImage="/background.jpg"
        strength={400}
        className="parallax-container"
      >
        <div style={{ height: "100vh" }} />
      </Parallax>

      <header className="p-6 text-center">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Superhero Finder
        </motion.h1>
        <motion.div
          className="mt-4 flex justify-center gap-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for a superhero..."
            className="p-3 w-80 rounded border-2"
          />
          <motion.button
            onClick={fetchSuperheroes}
            className="p-3 rounded font-bold"
            disabled={loading}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Searching..." : "Search"}
          </motion.button>
        </motion.div>
        <motion.div
          className="mt-4 flex justify-center gap-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <select
            value={publisherFilter}
            onChange={(e) => setPublisherFilter(e.target.value)}
            className="p-2 rounded border-2"
          >
            <option value="all">All Publishers</option>
            <option value="Marvel Comics">Marvel</option>
            <option value="DC Comics">DC</option>
          </select>
          <select
            value={alignmentFilter}
            onChange={(e) => setAlignmentFilter(e.target.value)}
            className="p-2 rounded border-2"
          >
            <option value="all">All Alignments</option>
            <option value="good">Hero</option>
            <option value="bad">Villain</option>
            <option value="neutral">Neutral</option>
          </select>
        </motion.div>
        <motion.div
          className="mt-4 flex justify-center gap-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.button
            onClick={() => setShowFavorites(true)}
            className="p-3 rounded font-bold"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            View Favorites ({favorites.length})
          </motion.button>
          <motion.button
            onClick={() => setShowLeaderboard(true)}
            className="p-3 rounded font-bold"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            View Leaderboard
          </motion.button>
          <motion.button
            onClick={resetData}
            className="p-3 rounded font-bold bg-red-500 text-white hover:bg-red-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset Data
          </motion.button>
          <motion.button
            onClick={toggleTheme}
            className="p-3 rounded font-bold"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </motion.button>
        </motion.div>
      </header>
      <main className="p-6">
        <AnimatePresence>
          {loading ? (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="spinner"></div>
              <p>Loading...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <p className="error-message mb-4">{error}</p>
              <motion.button
                onClick={() => {
                  setError(null);
                  fetchSuperheroes();
                }}
                className="p-3 rounded font-bold"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Again
              </motion.button>
            </motion.div>
          ) : showComparison ? (
            <motion.div
              className="flex justify-center gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {selectedHeroes.map((hero) => (
                <motion.div
                  key={hero.id}
                  className="hero-card w-80 p-4 text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={hero.image.url}
                    alt={hero.name}
                    className="w-full rounded"
                  />
                  <h2 className="mt-2 text-xl">{hero.name}</h2>
                  <p>Intelligence: {hero.powerstats.intelligence}</p>
                  <p>Strength: {hero.powerstats.strength}</p>
                  <p>Speed: {hero.powerstats.speed}</p>
                  <p>Durability: {hero.powerstats.durability}</p>
                  <p>Power: {hero.powerstats.power}</p>
                  <p>Combat: {hero.powerstats.combat}</p>
                </motion.div>
              ))}
              <motion.button
                onClick={() => setShowComparison(false)}
                className="mt-4 p-3 rounded font-bold"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Search
              </motion.button>
            </motion.div>
          ) : showPollResults ? (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4">Poll Results</h2>
              {heroes.map((hero) => (
                <div key={hero.id} className="mb-2">
                  <p>
                    {hero.name}: {votes[hero.id] || 0} votes (
                    {totalVotes > 0
                      ? ((votes[hero.id] || 0) / totalVotes * 100).toFixed(1)
                      : 0}
                    %)
                  </p>
                </div>
              ))}
              <motion.button
                onClick={() => setShowPollResults(false)}
                className="mt-4 p-3 rounded font-bold"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Search
              </motion.button>
            </motion.div>
          ) : showQuiz ? (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4">Guess the Superhero!</h2>
              <p>Clue 1: Publisher - {quizHero.biography.publisher}</p>
              <p>Clue 2: Alignment - {quizHero.biography.alignment}</p>
              <p>Clue 3: Strength - {quizHero.powerstats.strength}</p>
              <select
                value={quizGuess}
                onChange={(e) => setQuizGuess(e.target.value)}
                className="mt-4 p-2 rounded border-2"
              >
                <option value="">Select a hero...</option>
                {heroes.map((hero) => (
                  <option key={hero.id} value={hero.name}>
                    {hero.name}
                  </option>
                ))}
              </select>
              <motion.button
                onClick={handleQuizGuess}
                className="mt-4 ml-2 p-3 rounded font-bold"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Submit Guess
              </motion.button>
              {quizResult && (
                <div className="mt-4">
                  <p>{quizResult}</p>
                  <motion.button
                    onClick={() => setShowQuiz(false)}
                    className="mt-2 p-3 rounded font-bold"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Back to Search
                  </motion.button>
                </div>
              )}
            </motion.div>
          ) : showFavorites ? (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4">Favorite Superheroes</h2>
              {favorites.length === 0 ? (
                <p>No favorites yet!</p>
              ) : (
                <div className="flex flex-wrap justify-center">
                  {favorites.map((hero, index) => (
                    <Tilt
                      key={hero.id}
                      className="tilt-card"
                      options={{ max: 25, scale: 1.05, speed: 300 }}
                    >
                      <motion.div
                        className="hero-card w-60 m-4 p-4 text-center"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <motion.button
                          onClick={() => toggleFavorite(hero)}
                          className="mb-2 text-yellow-400"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          ★
                        </motion.button>
                        <Link to={`/hero/${hero.id}`}>
                          <img
                            src={hero.image.url}
                            alt={hero.name}
                            className="w-full rounded"
                          />
                          <h2 className="mt-2 text-xl">{hero.name}</h2>
                        </Link>
                        <p>{hero.biography["full-name"] || "Unknown"}</p>
                        <p>{hero.biography.publisher}</p>
                      </motion.div>
                    </Tilt>
                  ))}
                </div>
              )}
              <motion.button
                onClick={() => setShowFavorites(false)}
                className="mt-4 p-3 rounded font-bold"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Search
              </motion.button>
            </motion.div>
          ) : showLeaderboard ? (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
              {leaderboard.length === 0 ? (
                <p>No votes yet!</p>
              ) : (
                <div>
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={index}
                      className="mb-2"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <p>
                        {index + 1}. {entry.name}: {entry.votes} votes
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
              <motion.button
                onClick={() => setShowLeaderboard(false)}
                className="mt-4 p-3 rounded font-bold"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Search
              </motion.button>
            </motion.div>
          ) : (
            <>
              <AnimatePresence>
                {heroes.length > 0 && (
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.button
                      onClick={handleCompare}
                      disabled={selectedHeroes.length !== 2}
                      className={`mt-4 p-3 rounded font-bold ${
                        selectedHeroes.length === 2 ? "" : "bg-gray-500 text-gray-300 cursor-not-allowed"
                      }`}
                      whileHover={{ scale: selectedHeroes.length === 2 ? 1.1 : 1 }}
                      whileTap={{ scale: selectedHeroes.length === 2 ? 0.95 : 1 }}
                    >
                      Compare Selected ({selectedHeroes.length}/2)
                    </motion.button>
                    <motion.button
                      onClick={startQuiz}
                      className="mt-4 ml-4 p-3 rounded font-bold"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Quiz
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex flex-wrap justify-center">
                {heroes.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    Search for a hero!
                  </motion.p>
                ) : (
                  currentHeroes.map((hero, index) => (
                    <Tilt
                      key={hero.id}
                      className="tilt-card"
                      options={{ max: 25, scale: 1.05, speed: 300 }}
                    >
                      <motion.div
                        className="hero-card w-60 m-4 p-4 text-center"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-center">
                          <input
                            type="checkbox"
                            checked={selectedHeroes.includes(hero)}
                            onChange={() => handleSelectHero(hero)}
                            className="mb-2"
                          />
                          <motion.button
                            onClick={() => toggleFavorite(hero)}
                            className={`mb-2 ${
                              favorites.some((fav) => fav.id === hero.id)
                                ? "text-yellow-400"
                                : "text-gray-400"
                            }`}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            ★
                          </motion.button>
                        </div>
                        <Link to={`/hero/${hero.id}`}>
                          <img
                            src={hero.image.url}
                            alt={hero.name}
                            className="w-full rounded"
                          />
                          <h2 className="mt-2 text-xl">{hero.name}</h2>
                        </Link>
                        <p>{hero.biography["full-name"] || "Unknown"}</p>
                        <p>{hero.biography.publisher}</p>
                        <motion.button
                          onClick={() => handleVote(hero.id)}
                          className="mt-2 p-2 rounded font-bold"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Vote
                        </motion.button>
                      </motion.div>
                    </Tilt>
                  ))
                )}
              </div>
              {heroes.length > 0 && (
                <motion.div
                  className="text-center mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-3 rounded font-bold mx-2"
                    whileHover={{ scale: currentPage === 1 ? 1 : 1.1 }}
                    whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
                  >
                    Previous
                  </motion.button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <motion.button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-3 rounded font-bold mx-2"
                    whileHover={{ scale: currentPage === totalPages ? 1 : 1.1 }}
                    whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
                  >
                    Next
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default MainContent;