import { FaSearch } from "react-icons/fa";

const SearchBar = ({ query, setQuery, fetchSuperheroes, loading }) => (
  <div className="search-container mb-6 flex items-center justify-center gap-4">
    <div className="relative flex-1 max-w-xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && fetchSuperheroes()}
        placeholder="Search for a superhero..."
        className="input-primary"
      />
      <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
    <button
      onClick={fetchSuperheroes}
      disabled={loading}
      className="btn-primary"
    >
      {loading ? "Searching..." : "Search"}
    </button>
  </div>
);

export default SearchBar;
