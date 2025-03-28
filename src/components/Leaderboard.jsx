import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Leaderboard = ({ heroes, onClose }) => {
  const [category, setCategory] = useState('overall');
  const [sortedHeroes, setSortedHeroes] = useState([]);

  const categories = {
    overall: 'Overall Power',
    intelligence: 'Intelligence',
    strength: 'Strength',
    speed: 'Speed',
    durability: 'Durability',
    power: 'Power',
    combat: 'Combat'
  };

  useEffect(() => {
    const calculateScore = (hero) => {
      if (category === 'overall') {
        return Object.values(hero.powerstats).reduce((sum, stat) => sum + parseInt(stat || 0), 0);
      }
      return parseInt(hero.powerstats[category] || 0);
    };

    const sorted = [...heroes].sort((a, b) => calculateScore(b) - calculateScore(a)).slice(0, 20);
    setSortedHeroes(sorted);
  }, [category, heroes]);

  const getMedalEmoji = (index) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="leaderboard-container max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Superhero Leaderboard</h2>
        <button onClick={onClose} className="btn-secondary">
          Close
        </button>
      </div>

      <div className="mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="filter-select"
        >
          {Object.entries(categories).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="py-3 px-4 text-left">Rank</th>
              <th className="py-3 px-4 text-left">Hero</th>
              <th className="py-3 px-4 text-left">Publisher</th>
              <th className="py-3 px-4 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {sortedHeroes.map((hero, index) => {
              const score = category === 'overall'
                ? Object.values(hero.powerstats).reduce((sum, stat) => sum + parseInt(stat || 0), 0)
                : parseInt(hero.powerstats[category] || 0);

              return (
                <motion.tr
                  key={hero.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b dark:border-gray-700"
                >
                  <td className="py-3 px-4">
                    {getMedalEmoji(index)} {index + 1}
                  </td>
                  <td className="py-3 px-4 font-medium">
                    <div className="flex items-center gap-3">
                      <img
                        src={hero.image.url}
                        alt={hero.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      {hero.name}
                    </div>
                  </td>
                  <td className="py-3 px-4">{hero.biography.publisher}</td>
                  <td className="py-3 px-4 text-right">{score}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Leaderboard;
