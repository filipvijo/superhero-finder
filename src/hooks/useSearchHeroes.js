import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function useSearchHeroes() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/search?query=${encodeURIComponent(query)}`);

      if (response.data.response === 'success') {
        if (response.data.results) {
          setHeroes(response.data.results);
        } else {
          setError(t('noHeroes'));
          setHeroes([]);
        }
      } else {
        console.error('API returned an error:', response.data);
        setError(t('searchError'));
        setHeroes([]);
      }
    } catch (err) {
      console.error('Error fetching heroes:', err);
      setError(t('searchError'));
      setHeroes([]);
    }

    setLoading(false);
  };

  return { heroes, loading, error, handleSearch };
}

export default useSearchHeroes; // Ensure default export
