import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import HeroCard from './HeroCard';
import HeroVictoryCard from './HeroVictoryCard';

const GuessHero = ({ onClose, addToCollection }) => {
  const [hero, setHero] = useState(null);
  const [clues, setClues] = useState([]);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showVictoryCard, setShowVictoryCard] = useState(false);
  const maxAttempts = 10;
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
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a comic book expert creating clues for a superhero guessing game. Create 10 clues that hint at the hero\'s identity without directly revealing their name. Make the clues progressively easier, with the first one being very difficult and the last one being more obvious but still challenging. Return ONLY a JSON array of 10 strings, nothing else.'
            },
            {
              role: 'user',
              content: `Create 10 clues for ${hero.name} in ${i18n.language === 'fr' ? 'French' : 'English'}. Here's their information:
                Powers: ${Object.entries(hero.powerstats).map(([key, value]) => `${key}: ${value}`).join(', ')}
                Biography: ${Object.entries(hero.biography).map(([key, value]) => `${key}: ${value}`).join(', ')}
                Appearance: ${Object.entries(hero.appearance).map(([key, value]) => `${key}: ${value}`).join(', ')}
                Work: ${Object.entries(hero.work).map(([key, value]) => `${key}: ${value}`).join(', ')}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      // Clean up the content to ensure it's valid JSON
      const cleanContent = content
        .replace(/```json\n?|\n?```/g, '') // Remove code blocks
        .replace(/[\n\r]/g, '') // Remove newlines
        .trim();

      try {
        const cluesArray = JSON.parse(cleanContent);
        if (!Array.isArray(cluesArray) || cluesArray.length < 5) { // Allow at least 5 clues
          throw new Error('Invalid clues format');
        }
        setClues(cluesArray);
        setLoading(false);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.log('Content received:', cleanContent);
        throw new Error('Invalid clues format');
      }
    } catch (err) {
      console.error('Error generating clues:', err);
      setError(t('noInformation'));
      setLoading(false);
    }
  };

  const handleGuess = () => {
    if (!guess.trim()) return;

    const isCorrect = guess.toLowerCase() === hero.name.toLowerCase();
    if (isCorrect) {
      setSuccess(true);
      setGameOver(true);
      addToCollection(hero, 'guessHero'); // Specify the source as guessHero
      setShowVictoryCard(true);
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
    setShowVictoryCard(false);
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 overflow-y-auto py-8">
      {showVictoryCard && success && hero ? (
        <HeroVictoryCard
          hero={hero}
          onClose={onClose}
          onPlayAgain={handlePlayAgain}
        />
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full mx-4"
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
                  <div className="font-bold mb-1">{t('question')} {index + 1}/{clues.length}</div>
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
                  onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                  placeholder={t('enterGuess')}
                  className="flex-1 px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
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
            {success ? (
              <>
                <h3 className="text-xl font-bangers mb-4 text-green-600" style={{ letterSpacing: '1px' }}>
                  {t('correctGuess')}
                </h3>
                <div className="mb-4">
                  <HeroCard
                    hero={hero}
                    handleSelectHero={() => {}}
                    toggleFavorite={() => {}}
                    favorites={[]}
                  />
                </div>
              </>
            ) : (
              <h3 className="text-xl font-bangers mb-4 text-red-600" style={{ letterSpacing: '1px' }}>
                {t('wrongGuess', { heroName: hero.name })}
              </h3>
            )}
            <button
              onClick={handlePlayAgain}
              className="px-6 py-2 bg-yellow-400 text-black font-bangers rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              style={{ letterSpacing: '1px' }}
            >
              {t('playAgain')}
            </button>
          </div>
        )}
      </motion.div>
      )}
    </div>
  );
};

export default GuessHero;
