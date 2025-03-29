import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

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
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchRandomHero();
  }, []);

  const fetchRandomHero = async () => {
    try {
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
      setError(t('noInformation'));
      setLoading(false);
    }
  };

  const generateClues = async (hero) => {
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey || apiKey === 'your_openai_api_key_here') {
        throw new Error(t('noInformation'));
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a comic book expert creating clues for a superhero guessing game. Create 3 clues that hint at the hero's identity without directly revealing their name. Make the clues progressively easier, with the last one being quite obvious. Return the clues as a simple JSON array of strings, with no markdown formatting or additional text. The clues should be in ${i18n.language === 'fr' ? 'French' : 'English'}.`
            },
            {
              role: 'user',
              content: `Create 3 clues for ${hero.name} in ${i18n.language === 'fr' ? 'French' : 'English'}. Here's their information:
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
      const cleanContent = content.replace(/```json\n|\n```/g, '').trim();
      const cluesArray = JSON.parse(cleanContent);
      
      if (!Array.isArray(cluesArray) || cluesArray.length !== 3) {
        throw new Error(t('noInformation'));
      }

      setClues(cluesArray);
      setLoading(false);
    } catch (err) {
      console.error('Error generating clues:', err);
      if (err.response?.status === 401) {
        setError(t('noInformation'));
      } else if (err.message === 'Invalid clues format received from API') {
        setError(t('noInformation'));
      } else {
        setError(err.message || t('noInformation'));
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
      onUnlock();
    } else {
      setAttempts(prev => prev + 1);
      if (attempts + 1 >= maxAttempts) {
        setGameOver(true);
      }
    }
    setGuess('');
  };

  const handlePlayAgain = () => {
    setHero(null);
    setClues([]);
    setGuess('');
    setAttempts(0);
    setLoading(true);
    setError(null);
    setGameOver(false);
    setSuccess(false);
    fetchRandomHero();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
        <div className="bg-white p-8 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-8 border-yellow-400 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-xl font-bangers" style={{ letterSpacing: '1px' }}>
            {t('loading')}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
        <div className="bg-white p-8 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full">
          <h2 className="text-2xl font-bangers mb-4 text-center" style={{ letterSpacing: '1px' }}>
            {t('error')}
          </h2>
          <p className="text-red-600 mb-6 text-center">{error}</p>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-yellow-400 text-black font-bangers rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              style={{ letterSpacing: '1px' }}
            >
              {t('close')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bangers" style={{ letterSpacing: '1px' }}>
            {t('guessHeroTitle')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {!gameOver ? (
          <>
            <div className="space-y-4 mb-6">
              {clues.slice(0, attempts + 1).map((clue, index) => (
                <div
                  key={index}
                  className="p-4 bg-yellow-100 rounded-lg border-2 border-black"
                >
                  {clue}
                </div>
              ))}
            </div>

            <div className="mb-4">
              <p className="text-sm font-bold mb-2">
                {t('attemptsLeft')}: {maxAttempts - attempts}
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                  className="flex-1 px-3 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder={t('enterGuess')}
                />
                <button
                  onClick={handleGuess}
                  className="px-4 py-2 bg-yellow-400 text-black font-bangers rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ letterSpacing: '1px' }}
                >
                  {t('guess')}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-bangers mb-4" style={{ letterSpacing: '1px' }}>
              {success ? t('congratulations') : t('gameOver')}
            </h3>
            <p className="mb-6">
              {success
                ? t('correctGuess')
                : t('heroWas', { name: hero.name })}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handlePlayAgain}
                className="px-6 py-2 bg-yellow-400 text-black font-bangers rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ letterSpacing: '1px' }}
              >
                {t('playAgain')}
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-black font-bangers rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ letterSpacing: '1px' }}
              >
                {t('close')}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GuessHero;
