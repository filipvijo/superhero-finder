import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const GuessHero = ({ onClose, onUnlock }) => {
  const [hero, setHero] = useState(null);
  const [clues, setClues] = useState([]);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [success, setSuccess] = useState(false);
  const maxAttempts = 3;

  useEffect(() => {
    fetchRandomHero();
  }, []);

  const fetchRandomHero = async () => {
    try {
      // Get a random ID between 1 and 731 (total number of heroes in the API)
      const randomId = Math.floor(Math.random() * 731) + 1;
      const response = await axios.get(
        `https://superheroapi.com/api.php/${import.meta.env.VITE_SUPERHERO_API_KEY}/${randomId}`
      );

      if (response.data.response === 'success') {
        setHero(response.data);
        await generateClues(response.data);
      } else {
        throw new Error('Failed to fetch hero');
      }
    } catch (err) {
      console.error('Error fetching hero:', err);
      setError('Failed to fetch hero. Please try again.');
      setLoading(false);
    }
  };

  const generateClues = async (hero) => {
    try {
      // Check if OpenAI API key is configured
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey || apiKey === 'your_openai_api_key_here') {
        throw new Error('OpenAI API key not configured. Please add your API key to the .env file.');
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a comic book expert creating clues for a superhero guessing game. Create 3 clues that hint at the hero\'s identity without directly revealing their name. Make the clues progressively easier, with the last one being quite obvious. Return the clues as a simple JSON array of strings, with no markdown formatting or additional text.'
            },
            {
              role: 'user',
              content: `Create 3 clues for ${hero.name}. Here's their information:
                Powers: ${Object.entries(hero.powerstats).map(([key, value]) => `${key}: ${value}`).join(', ')}
                Biography: ${Object.entries(hero.biography).map(([key, value]) => `${key}: ${value}`).join(', ')}
                Appearance: ${Object.entries(hero.appearance).map(([key, value]) => `${key}: ${value}`).join(', ')}
                Work: ${Object.entries(hero.work).map(([key, value]) => `${key}: ${value}`).join(', ')}`
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      // Clean up the response by removing any markdown formatting
      const cleanContent = content.replace(/```json\n|\n```/g, '').trim();
      const cluesArray = JSON.parse(cleanContent);
      
      if (!Array.isArray(cluesArray) || cluesArray.length !== 3) {
        throw new Error('Invalid clues format received from API');
      }

      setClues(cluesArray);
      setLoading(false);
    } catch (err) {
      console.error('Error generating clues:', err);
      if (err.response?.status === 401) {
        setError('Invalid OpenAI API key. Please check your .env file and add a valid API key.');
      } else if (err.message === 'Invalid clues format received from API') {
        setError('Failed to generate proper clues. Please try again.');
      } else {
        setError(err.message || 'Failed to generate clues. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleGuess = () => {
    if (!guess.trim()) return;

    const isCorrect = guess.toLowerCase() === hero.name.toLowerCase();
    if (isCorrect) {
      setSuccess(true);
      setGameOver(true);
      onUnlock(hero);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= maxAttempts) {
        setGameOver(true);
      }
      setGuess('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          className="bg-white rounded-lg p-8 max-w-lg w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-8 border-yellow-400 border-t-transparent"></div>
            <p className="mt-4 text-2xl font-bangers text-yellow-400" style={{ letterSpacing: '1px' }}>
              LOADING CLUES...
            </p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          className="bg-white rounded-lg p-8 max-w-lg w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          onClick={e => e.stopPropagation()}
        >
          <div className="text-center space-y-6">
            <p className="text-xl font-bangers text-red-500" style={{ letterSpacing: '1px' }}>
              {error}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  fetchRandomHero();
                }}
                className="px-6 py-3 bg-blue-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ letterSpacing: '1px' }}
              >
                TRY AGAIN
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-red-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ letterSpacing: '1px' }}
              >
                CLOSE
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        className="bg-white rounded-lg p-8 max-w-2xl w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-4xl font-bangers text-center mb-8" style={{ letterSpacing: '2px' }}>
          GUESS THE HERO!
        </h2>

        {gameOver ? (
          <div className="text-center space-y-6">
            {success ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="space-y-4"
              >
                <p className="text-2xl font-bangers text-green-500" style={{ letterSpacing: '1px' }}>
                  CONGRATULATIONS!
                </p>
                <div className="relative w-48 h-48 mx-auto">
                  <img
                    src={hero.image.url}
                    alt={hero.name}
                    className="w-full h-full object-cover rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
                <h3 className="text-3xl font-bangers" style={{ letterSpacing: '1px' }}>
                  {hero.name}
                </h3>
                <p className="text-gray-600">
                  {hero.biography['full-name']}
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-green-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ letterSpacing: '1px' }}
                >
                  AWESOME!
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="space-y-4"
              >
                <p className="text-2xl font-bangers text-red-500" style={{ letterSpacing: '1px' }}>
                  GAME OVER!
                </p>
                <p className="text-xl">
                  The hero was: <span className="font-bangers">{hero.name}</span>
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setGameOver(false);
                      setAttempts(0);
                      setGuess('');
                      setLoading(true);
                      fetchRandomHero();
                    }}
                    className="px-6 py-3 bg-blue-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                    style={{ letterSpacing: '1px' }}
                  >
                    PLAY AGAIN
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-red-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                    style={{ letterSpacing: '1px' }}
                  >
                    CLOSE
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Clues */}
            <div className="space-y-4">
              {clues.map((clue, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="p-4 bg-yellow-50 rounded-lg border-2 border-black"
                >
                  <p className="font-bangers text-lg" style={{ letterSpacing: '1px' }}>
                    Clue #{index + 1}: {clue}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Guess Input */}
            <div className="flex gap-4">
              <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your guess..."
                className="flex-1 px-4 py-2 text-xl font-bangers bg-white/90 rounded-lg border-4 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                style={{ letterSpacing: '1px' }}
              />
              <button
                onClick={handleGuess}
                className="px-6 py-2 bg-green-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ letterSpacing: '1px' }}
              >
                GUESS!
              </button>
            </div>

            {/* Attempts Counter */}
            <div className="flex justify-between items-center">
              <span className="font-bangers text-gray-600" style={{ letterSpacing: '1px' }}>
                Attempts: {attempts}/{maxAttempts}
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ letterSpacing: '1px' }}
              >
                GIVE UP
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default GuessHero;
