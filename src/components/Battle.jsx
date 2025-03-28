import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Battle = ({ heroes, onClose }) => {
  const [hero1, setHero1] = useState(null);
  const [hero2, setHero2] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const startBattle = async () => {
    if (!hero1 || !hero2) return;

    setIsLoading(true);
    try {
      const prompt = `Create an exciting and dramatic battle scenario between ${hero1.name} and ${hero2.name}. Consider their powers (${hero1.name}: ${Object.entries(hero1.powerstats).map(([key, value]) => `${key}: ${value}`).join(', ')}) and (${hero2.name}: ${Object.entries(hero2.powerstats).map(([key, value]) => `${key}: ${value}`).join(', ')}). Write a brief, engaging story (2-3 sentences) about how the battle unfolds and who wins. Make it epic and comic book style!`;

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a comic book narrator describing epic superhero battles.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      setBattleResult(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating battle result:', error);
      setBattleResult('Error generating battle result. Please try again.');
    }
    setIsLoading(false);
  };

  const heroCard = (hero, setHero, position) => (
    <motion.div
      initial={{ opacity: 0, x: position === 'left' ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-64"
    >
      {hero ? (
        <div className="relative">
          <img
            src={hero.image.url}
            alt={hero.name}
            className="w-full h-64 object-cover rounded-lg shadow-lg"
          />
          <button
            onClick={() => setHero(null)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
          >
            ×
          </button>
          <h3 className="mt-2 text-center font-bold dark:text-white">{hero.name}</h3>
        </div>
      ) : (
        <div className="relative">
          <select
            onChange={(e) => {
              const selected = heroes.find(h => h.id === e.target.value);
              setHero(selected);
            }}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select a hero</option>
            {heroes.map(hero => (
              <option key={hero.id} value={hero.id}>
                {hero.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-4xl w-full relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
          Superhero Battle
        </h2>

        <div className="flex justify-between items-center gap-8 mb-8">
          {heroCard(hero1, setHero1, 'left')}
          <div className="text-4xl font-bold text-red-500">VS</div>
          {heroCard(hero2, setHero2, 'right')}
        </div>

        {!battleResult && (
          <div className="text-center">
            <button
              onClick={startBattle}
              disabled={!hero1 || !hero2 || isLoading}
              className={`px-8 py-3 rounded-lg text-white font-bold ${
                !hero1 || !hero2 || isLoading
                  ? 'bg-gray-400'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isLoading ? 'Battling...' : 'FIGHT!'}
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {battleResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              <div className="bg-yellow-50 dark:bg-gray-700 p-6 rounded-lg">
                <p className="text-lg text-center dark:text-white" style={{ fontFamily: "'Comic Neue', cursive" }}>
                  {battleResult}
                </p>
              </div>
              <div className="text-center mt-4">
                <button
                  onClick={() => {
                    setBattleResult(null);
                    setHero1(null);
                    setHero2(null);
                  }}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  New Battle
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Battle;
