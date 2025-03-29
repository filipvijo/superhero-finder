import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const PersonalityQuiz = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const { t, i18n } = useTranslation();

  const questions = [
    {
      en: "What's your preferred approach to solving problems?",
      fr: "Quelle est votre approche préférée pour résoudre les problèmes?",
      options: {
        en: ["Use intelligence and strategy", "Rely on physical strength", "Work with a team", "Use technology"],
        fr: ["Utiliser l'intelligence et la stratégie", "Compter sur la force physique", "Travailler en équipe", "Utiliser la technologie"]
      }
    },
    {
      en: "How would you prefer to help others?",
      fr: "Comment préférez-vous aider les autres?",
      options: {
        en: ["Protect them from harm", "Teach and guide them", "Fight for justice", "Provide resources and support"],
        fr: ["Les protéger du danger", "Les enseigner et les guider", "Lutter pour la justice", "Fournir des ressources et du soutien"]
      }
    },
    {
      en: "What's your biggest strength?",
      fr: "Quelle est votre plus grande force?",
      options: {
        en: ["Mental abilities", "Physical prowess", "Leadership skills", "Determination"],
        fr: ["Capacités mentales", "Prouesses physiques", "Compétences en leadership", "Détermination"]
      }
    },
    {
      en: "What motivates you the most?",
      fr: "Qu'est-ce qui vous motive le plus?",
      options: {
        en: ["Helping others", "Personal growth", "Justice and righteousness", "Adventure and excitement"],
        fr: ["Aider les autres", "Développement personnel", "Justice et droiture", "Aventure et excitation"]
      }
    }
  ];

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      findMatch(newAnswers);
    }
  };

  const findMatch = async (finalAnswers) => {
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) throw new Error(t('noInformation'));

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a superhero expert. Based on the user's answers, suggest a superhero that matches their personality. Respond in ${i18n.language === 'fr' ? 'French' : 'English'} with a JSON object containing: name (string), reason (string explaining why this hero matches).`
            },
            {
              role: 'user',
              content: `Find a matching superhero based on these answers: ${finalAnswers.join(', ')}`
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
      const match = JSON.parse(content);
      setResult(match);
    } catch (err) {
      console.error('Error finding match:', err);
      setError(t('noInformation'));
    }
    setLoading(false);
  };

  const handlePlayAgain = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setError(null);
  };

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
            {t('findMatchTitle')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-8 border-yellow-400 border-t-transparent"></div>
            <p className="mt-4 text-xl font-bangers" style={{ letterSpacing: '1px' }}>
              {t('loading')}
            </p>
          </div>
        ) : result ? (
          <div className="text-center">
            <h3 className="text-xl font-bangers mb-4" style={{ letterSpacing: '1px' }}>
              {t('yourMatch')}
            </h3>
            <p className="text-2xl font-bangers mb-4" style={{ letterSpacing: '1px' }}>
              {result.name}
            </p>
            <p className="mb-6">{result.reason}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handlePlayAgain}
                className="px-6 py-2 bg-yellow-400 text-black font-bangers rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ letterSpacing: '1px' }}
              >
                {t('tryAgain')}
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
        ) : (
          <div>
            <p className="text-lg mb-6">
              {questions[currentQuestion][i18n.language]}
            </p>
            <div className="space-y-3">
              {questions[currentQuestion].options[i18n.language].map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full py-2 px-4 bg-white text-black font-bangers rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-400 transition-all text-left"
                  style={{ letterSpacing: '1px' }}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              {t('question')} {currentQuestion + 1}/{questions.length}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PersonalityQuiz;
