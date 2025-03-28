import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const questions = [
  {
    id: 1,
    text: "What's your preferred way of solving problems?",
    options: [
      "Using intelligence and strategy",
      "Raw strength and power",
      "Speed and agility",
      "Technology and gadgets"
    ]
  },
  {
    id: 2,
    text: "How do you prefer to work?",
    options: [
      "Solo - I work best alone",
      "With a partner",
      "As part of a team",
      "Leading others"
    ]
  },
  {
    id: 3,
    text: "What's your moral compass like?",
    options: [
      "Strictly good - I always follow the rules",
      "Chaotic good - I do what's right, even if it breaks rules",
      "Neutral - I do what's necessary",
      "Anti-hero - The ends justify the means"
    ]
  },
  {
    id: 4,
    text: "What's your biggest strength?",
    options: [
      "Mental abilities and intelligence",
      "Physical strength and endurance",
      "Adaptability and quick thinking",
      "Willpower and determination"
    ]
  },
  {
    id: 5,
    text: "What's your preferred environment?",
    options: [
      "Urban settings - cities and buildings",
      "Remote locations - wilderness or space",
      "Underground or hidden bases",
      "Anywhere the action is"
    ]
  }
];

const PersonalityQuiz = ({ onClose, onHeroMatch }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnswer = async (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered, find a match
      setLoading(true);
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are a superhero matching expert. Based on the user\'s answers, determine which superhero best matches their personality. Return ONLY the superhero\'s name as a string, no other text.'
              },
              {
                role: 'user',
                content: `Based on these answers, which superhero would be the best match? Return ONLY the hero name.
                  Question 1: ${questions[0].text}
                  Answer: ${newAnswers[0]}
                  
                  Question 2: ${questions[1].text}
                  Answer: ${newAnswers[1]}
                  
                  Question 3: ${questions[2].text}
                  Answer: ${newAnswers[2]}
                  
                  Question 4: ${questions[3].text}
                  Answer: ${newAnswers[3]}
                  
                  Question 5: ${questions[4].text}
                  Answer: ${newAnswers[4]}`
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

        const heroName = response.data.choices[0].message.content.trim();
        
        // Search for the hero
        const heroResponse = await axios.get(
          `https://superheroapi.com/api.php/${import.meta.env.VITE_SUPERHERO_API_KEY}/search/${heroName}`
        );

        if (heroResponse.data.response === 'success') {
          onHeroMatch(heroResponse.data.results[0]);
        } else {
          throw new Error('Could not find matching hero');
        }
      } catch (err) {
        console.error('Error finding hero match:', err);
        setError('Failed to find your hero match. Please try again.');
        setLoading(false);
      }
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
              FINDING YOUR MATCH...
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
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setError(null);
                setCurrentQuestion(0);
                setAnswers([]);
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
        </motion.div>
      </motion.div>
    );
  }

  const question = questions[currentQuestion];

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
          FIND YOUR HERO MATCH!
        </h2>

        <div className="space-y-8">
          {/* Progress Bar */}
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-black">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question */}
          <div className="text-center">
            <h3 className="text-2xl font-bangers mb-2" style={{ letterSpacing: '1px' }}>
              Question {currentQuestion + 1} of {questions.length}
            </h3>
            <p className="text-xl font-bangers text-gray-700" style={{ letterSpacing: '1px' }}>
              {question.text}
            </p>
          </div>

          {/* Options */}
          <div className="grid gap-4">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option)}
                className="w-full p-4 text-left font-bangers text-lg bg-white border-4 border-black rounded-lg hover:bg-blue-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ letterSpacing: '1px' }}
              >
                {option}
              </motion.button>
            ))}
          </div>

          {/* Cancel Button */}
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-red-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
              style={{ letterSpacing: '1px' }}
            >
              CANCEL
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PersonalityQuiz;
