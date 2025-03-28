import { useState } from 'react';
import { motion } from 'framer-motion';
import HeroCard from './HeroCard';

const Collection = ({ favorites, toggleFavorite, onClose, theme }) => {
  const [sortBy, setSortBy] = useState('name');
  const [filterPublisher, setFilterPublisher] = useState('all');

  const publishers = [...new Set(favorites.map(hero => hero.biography.publisher))];

  const sortHeroes = (heroes) => {
    return [...heroes].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'publisher':
          return a.biography.publisher.localeCompare(b.biography.publisher);
        case 'power':
          const powerA = Object.values(a.powerstats).reduce((sum, stat) => sum + parseInt(stat || 0), 0);
          const powerB = Object.values(b.powerstats).reduce((sum, stat) => sum + parseInt(stat || 0), 0);
          return powerB - powerA;
        default:
          return 0;
      }
    });
  };

  const filteredHeroes = favorites.filter(hero => 
    filterPublisher === 'all' || hero.biography.publisher === filterPublisher
  );

  const sortedHeroes = sortHeroes(filteredHeroes);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="collection-container p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Collection</h2>
        <button onClick={onClose} className="btn-secondary">
          Close
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="name">Sort by Name</option>
          <option value="publisher">Sort by Publisher</option>
          <option value="power">Sort by Power Level</option>
        </select>

        <select
          value={filterPublisher}
          onChange={(e) => setFilterPublisher(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Publishers</option>
          {publishers.map(publisher => (
            <option key={publisher} value={publisher}>
              {publisher}
            </option>
          ))}
        </select>
      </div>

      {sortedHeroes.length > 0 ? (
        <div className="cards-grid">
          {sortedHeroes.map((hero, index) => (
            <HeroCard
              key={hero.id}
              hero={hero}
              index={index}
              handleSelectHero={() => {}}
              selectedHeroes={[]}
              toggleFavorite={toggleFavorite}
              favorites={favorites}
              theme={theme}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No heroes in your collection yet. Add some by clicking the star icon on hero cards!
        </p>
      )}
    </motion.div>
  );
};

export default Collection;
