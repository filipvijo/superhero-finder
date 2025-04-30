import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook for searching heroes
 * @returns {Object} Hero search state and functions
 */
const useHeroSearch = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedHero, setSelectedHero] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Search for heroes based on query
   */
  const searchHero = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setResults([]);
    
    try {
      const response = await axios.get(`/api/search?query=${encodeURIComponent(query)}`);
      if (response.data.response === 'success' && response.data.results) {
        setResults(response.data.results);
      } else {
        setError(t('noResultsFound'));
      }
    } catch (err) {
      console.error('Error searching hero:', err);
      setError(t('searchError'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Select a hero from search results
   * @param {Object} hero - The hero to select
   */
  const selectHero = (hero) => {
    setSelectedHero(hero);
    setResults([]);
  };

  /**
   * Reset the hero search state
   */
  const resetSearch = () => {
    setQuery('');
    setResults([]);
    setSelectedHero(null);
    setError(null);
  };

  return {
    query,
    setQuery,
    results,
    selectedHero,
    setSelectedHero,
    loading,
    error,
    searchHero,
    selectHero,
    resetSearch
  };
};

export default useHeroSearch;
