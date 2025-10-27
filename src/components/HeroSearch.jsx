import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { getOptimizedImageUrl, getResponsiveImageSize, getAkababImageUrl, getHeroImageUrl } from '../utils/imageOptimizer';

/**
 * Hero search component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Hero search component
 */
const HeroSearch = ({
  query,
  setQuery,
  loading,
  error,
  results,
  selectedHero,
  setSelectedHero,
  onSearch,
  onSelectHero,
  placeholder
}) => {
  const { t } = useTranslation();

  // Get appropriate image size based on device
  const imageSize = useMemo(() => getResponsiveImageSize(), []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={placeholder || t('searchHero')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow p-2 border-2 border-black rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          disabled={loading || !!selectedHero}
          aria-label={placeholder || t('searchHero')}
        />
        <button
          onClick={onSearch}
          disabled={loading || !query || !!selectedHero}
          className="px-4 py-2 bg-blue-500 text-white rounded border-2 border-black disabled:opacity-50 hover:bg-blue-600 transition-colors"
          aria-label={loading ? t('searching') : t('search')}
        >
          {loading ? t('searching') : t('search')}
        </button>
      </div>

      {selectedHero && (
        <div className="p-2 border-2 border-green-500 rounded bg-green-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={getHeroImageUrl(selectedHero, { size: 'sm' })}
              alt={selectedHero.name}
              className="w-10 h-10 object-cover rounded"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = getAkababImageUrl(selectedHero, 'sm');
              }}
            />
            <span className="font-semibold">{selectedHero.name}</span>
          </div>
          <button
            onClick={() => setSelectedHero(null)}
            className="text-sm text-red-500 hover:underline"
            aria-label={t('change')}
          >
            {t('change')}
          </button>
        </div>
      )}

      {!selectedHero && (
        <div className="border-2 border-black rounded p-2 min-h-[150px] max-h-[250px] overflow-y-auto bg-gray-50">
          {loading && <p className="text-center text-gray-500">{t('loading')}...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {results.map(hero => (
            <div
              key={hero.id}
              onClick={() => onSelectHero(hero)}
              className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200 rounded"
              role="button"
              tabIndex={0}
              aria-label={`Select ${hero.name}`}
              onKeyDown={(e) => e.key === 'Enter' && onSelectHero(hero)}
            >
              <img
                src={getHeroImageUrl(hero, { size: 'sm' })}
                alt={hero.name}
                className="w-8 h-8 object-cover rounded"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getAkababImageUrl(hero, 'sm');
                }}
              />
              <span>{hero.name}</span>
            </div>
          ))}
          {results.length === 0 && !loading && !error && (
            <p className="text-center text-gray-500">{t('searchForHeroes')}</p>
          )}
        </div>
      )}
    </div>
  );
};

HeroSearch.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  results: PropTypes.array.isRequired,
  selectedHero: PropTypes.object,
  setSelectedHero: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onSelectHero: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default HeroSearch;
