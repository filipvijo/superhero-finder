import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import MainContent from "./MainContent";
import HeroDetails from "./HeroDetails";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [heroes, setHeroes] = useState([]);
  const [publisherFilter, setPublisherFilter] = useState("all");
  const [alignmentFilter, setAlignmentFilter] = useState("all");
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [votes, setVotes] = useState(() => {
    const savedVotes = JSON.parse(localStorage.getItem("votes")) || {};
    console.log("Loaded votes from localStorage:", savedVotes);
    return savedVotes;
  });
  const [showPollResults, setShowPollResults] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizHero, setQuizHero] = useState(null);
  const [quizGuess, setQuizGuess] = useState("");
  const [quizResult, setQuizResult] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    console.log("Loaded favorites from localStorage:", savedFavorites);
    return savedFavorites;
  });
  const [showFavorites, setShowFavorites] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [voteHistory, setVoteHistory] = useState(() => {
    const savedHistory = JSON.parse(localStorage.getItem("voteHistory")) || {};
    console.log("Loaded voteHistory from localStorage:", savedHistory);
    return savedHistory;
  });
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark";
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const heroesPerPage = 10;

  // Save theme to local storage whenever it changes
  useEffect(() => {
    console.log("Saving theme to localStorage:", theme);
    localStorage.setItem("theme", theme);
    document.body.className = theme;
  }, [theme]);

  // Save votes to local storage whenever they change
  useEffect(() => {
    console.log("Saving votes to localStorage:", votes);
    localStorage.setItem("votes", JSON.stringify(votes));
  }, [votes]);

  // Save vote history to local storage whenever it changes
  useEffect(() => {
    console.log("Saving voteHistory to localStorage:", voteHistory);
    localStorage.setItem("voteHistory", JSON.stringify(voteHistory));
  }, [voteHistory]);

  // Save favorites to local storage whenever they change
  useEffect(() => {
    console.log("Saving favorites to localStorage:", favorites);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Reset currentPage when a new search is performed
  useEffect(() => {
    setCurrentPage(1);
  }, [heroes]);

  const fetchSuperheroes = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    setShowComparison(false);
    setShowPollResults(false);
    setShowQuiz(false);
    setShowFavorites(false);
    setShowLeaderboard(false);
    setSelectedHeroes([]);
    setQuizResult(null);
    try {
      const response = await axios.get(`https://superhero-proxy.onrender.com/search/${query}`);
      if (response.data.response === "success") {
        let filteredHeroes = response.data.results;

        // Filter by publisher
        if (publisherFilter !== "all") {
          filteredHeroes = filteredHeroes.filter(
            (hero) => hero.biography.publisher === publisherFilter
          );
        }

        // Filter by alignment
        if (alignmentFilter !== "all") {
          filteredHeroes = filteredHeroes.filter(
            (hero) => hero.biography.alignment === alignmentFilter
          );
        }

        setHeroes(filteredHeroes);
      } else {
        setHeroes([]);
        setError("No heroes found for this search.");
      }
    } catch (error) {
      console.error(error);
      setHeroes([]);
      setError("Failed to fetch heroes. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHero = (hero) => {
    if (selectedHeroes.includes(hero)) {
      setSelectedHeroes(selectedHeroes.filter((h) => h.id !== hero.id));
    } else if (selectedHeroes.length < 2) {
      setSelectedHeroes([...selectedHeroes, hero]);
    }
  };

  const handleCompare = () => {
    if (selectedHeroes.length === 2) {
      setShowComparison(true);
    }
  };

  const handleVote = (heroId) => {
    const hero = heroes.find((h) => h.id === heroId);
    if (hero) {
      setVotes((prevVotes) => ({
        ...prevVotes,
        [heroId]: (prevVotes[heroId] || 0) + 1,
      }));
      setVoteHistory((prevHistory) => ({
        ...prevHistory,
        [heroId]: { name: hero.name, publisher: hero.biography.publisher },
      }));
    }
    setShowPollResults(true);
  };

  const startQuiz = () => {
    if (heroes.length === 0) return;
    const randomHero = heroes[Math.floor(Math.random() * heroes.length)];
    setQuizHero(randomHero);
    setQuizGuess("");
    setQuizResult(null);
    setShowQuiz(true);
  };

  const handleQuizGuess = () => {
    if (quizGuess === quizHero.name) {
      setQuizResult("Correct! Great guess!");
    } else {
      setQuizResult(`Wrong! It was ${quizHero.name}.`);
    }
  };

  const toggleFavorite = (hero) => {
    console.log("Toggling favorite for:", hero.name);
    if (favorites.some((fav) => fav.id === hero.id)) {
      console.log("Removing from favorites:", hero.name);
      setFavorites(favorites.filter((fav) => fav.id !== hero.id));
    } else {
      console.log("Adding to favorites:", hero.name);
      setFavorites([...favorites, hero]);
    }
  };

  const resetData = () => {
    setVotes({});
    setVoteHistory({});
    setFavorites([]);
    localStorage.removeItem("votes");
    localStorage.removeItem("voteHistory");
    localStorage.removeItem("favorites");
    setShowPollResults(false);
    setShowLeaderboard(false);
    setShowFavorites(false);
    console.log("All data reset: votes, voteHistory, and favorites cleared.");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainContent
              query={query}
              setQuery={setQuery}
              heroes={heroes}
              setHeroes={setHeroes}
              publisherFilter={publisherFilter}
              setPublisherFilter={setPublisherFilter}
              alignmentFilter={alignmentFilter}
              setAlignmentFilter={setAlignmentFilter}
              selectedHeroes={selectedHeroes}
              setSelectedHeroes={setSelectedHeroes}
              showComparison={showComparison}
              setShowComparison={setShowComparison}
              votes={votes}
              setVotes={setVotes}
              showPollResults={showPollResults}
              setShowPollResults={setShowPollResults}
              showQuiz={showQuiz}
              setShowQuiz={setShowQuiz}
              quizHero={quizHero}
              setQuizHero={setQuizHero}
              quizGuess={quizGuess}
              setQuizGuess={setQuizGuess}
              quizResult={quizResult}
              setQuizResult={setQuizResult}
              favorites={favorites}
              setFavorites={setFavorites}
              showFavorites={showFavorites}
              setShowFavorites={setShowFavorites}
              showLeaderboard={showLeaderboard}
              setShowLeaderboard={setShowLeaderboard}
              voteHistory={voteHistory}
              setVoteHistory={setVoteHistory}
              theme={theme}
              toggleTheme={toggleTheme}
              fetchSuperheroes={fetchSuperheroes}
              handleSelectHero={handleSelectHero}
              handleCompare={handleCompare}
              handleVote={handleVote}
              startQuiz={startQuiz}
              handleQuizGuess={handleQuizGuess}
              toggleFavorite={toggleFavorite}
              resetData={resetData}
              loading={loading}
              error={error}
              setError={setError}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              heroesPerPage={heroesPerPage}
            />
          }
        />
        <Route
          path="/hero/:id"
          element={<HeroDetails heroes={heroes} favorites={favorites} />}
        />
      </Routes>
    </Router>
  );
}

export default App;