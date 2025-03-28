import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const DailyChallenge = ({ onClose, onComplete }) => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [completed, setCompleted] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const lastCompletedDate = localStorage.getItem('lastCompletedChallengeDate');
    const currentDate = new Date().toDateString();
    
    if (lastCompletedDate === currentDate) {
      setCompleted(true);
    }

    const currentStreak = localStorage.getItem('challengeStreak');
    if (currentStreak) {
      setStreak(parseInt(currentStreak));
    }

    generateChallenge();
  }, []);

  const generateChallenge = async () => {
    try {
      // Get a random hero for the challenge
      const randomId = Math.floor(Math.random() * 731) + 1;
      const response = await axios.get(
        `https://superheroapi.com/api.php/${import.meta.env.VITE_SUPERHERO_API_KEY}/${randomId}`
      );

      if (response.data.response === 'success') {
        const hero = response.data;
        
        // Generate a challenge question using OpenAI
        const challengeResponse = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are creating a daily superhero challenge. Create a challenging but fun question about the hero that tests knowledge of comic book lore. The question should be multiple choice with 4 options, only one being correct. Return the response as a JSON object with format: { "question": "string", "options": ["string"], "correctAnswer": "string", "explanation": "string" }'
              },
              {
                role: 'user',
                content: `Create a challenge question for ${hero.name}. Here's their information:
                  Powers: ${Object.entries(hero.powerstats).map(([key, value]) => `${key}: ${value}`).join(', ')}
                  Biography: ${Object.entries(hero.biography).map(([key, value]) => `${key}: ${value}`).join(', ')}
                  Appearance: ${Object.entries(hero.appearance).map(([key, value]) => `${key}: ${value}`).join(', ')}
                  Work: ${Object.entries(hero.work).map(([key, value]) => `${key}: ${value}`).join(', ')}`
              }
            ]
          },
          {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const content = challengeResponse.data.choices[0].message.content;
        const cleanContent = content.replace(/```json\n|\n```/g, '').trim();
        const challengeData = JSON.parse(cleanContent);

        setChallenge({
          hero,
          ...challengeData
        });
        setLoading(false);
      }
    } catch (err) {
      console.error('Error generating challenge:', err);
      setError('Failed to generate daily challenge. Please try again later.');
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (userAnswer === challenge.correctAnswer) {
      const currentDate = new Date().toDateString();
      localStorage.setItem('lastCompletedChallengeDate', currentDate);
      
      // Update streak
      const lastCompletedDate = localStorage.getItem('lastCompletedChallengeDate');
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastCompletedDate === yesterday.toDateString()) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('challengeStreak', newStreak.toString());
      } else {
        setStreak(1);
        localStorage.setItem('challengeStreak', '1');
      }

      setCompleted(true);
      onComplete();
    } else {
      setStreak(0);
      localStorage.setItem('challengeStreak', '0');
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
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-8 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-2xl font-bangers text-blue-500" style={{ letterSpacing: '1px' }}>
              PREPARING DAILY CHALLENGE...
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
          <p className="text-xl font-bangers text-center text-red-500 mb-6" style={{ letterSpacing: '1px' }}>
            {error}
          </p>
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-red-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
              style={{ letterSpacing: '1px' }}
            >
              CLOSE
            </button>
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
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bangers mb-2" style={{ letterSpacing: '2px' }}>
            DAILY CHALLENGE
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="font-bangers text-xl text-orange-500" style={{ letterSpacing: '1px' }}>
              {streak} Day Streak
            </span>
          </div>
        </div>

        {completed ? (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="space-y-4"
            >
              <p className="text-2xl font-bangers text-green-500" style={{ letterSpacing: '1px' }}>
                CHALLENGE COMPLETED!
              </p>
              <p className="text-gray-600">
                Come back tomorrow for a new challenge!
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-green-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ letterSpacing: '1px' }}
              >
                AWESOME!
              </button>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative w-48 h-48 mx-auto">
              <img
                src={challenge.hero.image.url}
                alt={challenge.hero.name}
                className="w-full h-full object-cover rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>

            <div className="p-6 bg-yellow-50 rounded-lg border-2 border-black">
              <p className="font-bangers text-xl mb-4" style={{ letterSpacing: '1px' }}>
                {challenge.question}
              </p>
              <div className="space-y-3">
                {challenge.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setUserAnswer(option)}
                    className={`w-full p-3 text-left font-bangers rounded-lg border-2 border-black transition-all ${
                      userAnswer === option
                        ? 'bg-blue-500 text-white'
                        : 'bg-white hover:bg-blue-50'
                    }`}
                    style={{ letterSpacing: '1px' }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleSubmit}
                disabled={!userAnswer}
                className={`px-6 py-3 font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  userAnswer ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}
                style={{ letterSpacing: '1px' }}
              >
                SUBMIT ANSWER
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
        )}
      </motion.div>
    </motion.div>
  );
};

export default DailyChallenge;
