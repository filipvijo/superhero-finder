import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import HeroCard from './HeroCard';
import HeroUnlockCard from './HeroUnlockCard';

// Fallback heroes to use if the API call fails
const fallbackHeroes = [
  {
    name: "Iron Man",
    reason: "You value intelligence, technology, and resourcefulness. Like Tony Stark, you're innovative and prefer to solve problems with your mind.",
    publisher: "Marvel Comics",
    image_url: "https://www.superherodb.com/pictures2/portraits/10/100/85.jpg",
    powers: ["Genius Intelligence", "Powered Armor", "Flight", "Energy Blasts", "Wealth"]
  },
  {
    name: "Wonder Woman",
    reason: "You have strong leadership qualities and believe in justice. Like Diana, you're compassionate but determined to protect others.",
    publisher: "DC Comics",
    image_url: "https://www.superherodb.com/pictures2/portraits/10/100/807.jpg",
    powers: ["Super Strength", "Enhanced Durability", "Combat Skills", "Lasso of Truth", "Flight"]
  },
  {
    name: "Spider-Man",
    reason: "You balance responsibility with a positive attitude. Like Peter Parker, you're resourceful and believe in using your abilities to help others.",
    publisher: "Marvel Comics",
    image_url: "https://www.superherodb.com/pictures2/portraits/10/100/133.jpg",
    powers: ["Wall-Crawling", "Super Agility", "Spider-Sense", "Enhanced Strength", "Web-Shooters"]
  },
  {
    name: "Batman",
    reason: "You rely on preparation and strategy. Like Bruce Wayne, you're determined and believe in justice through careful planning.",
    publisher: "DC Comics",
    image_url: "https://www.superherodb.com/pictures2/portraits/10/100/639.jpg",
    powers: ["Genius Intelligence", "Peak Human Condition", "Master Detective", "Martial Arts", "Advanced Technology"]
  }
];

// Function to get a fallback hero based on answers
const getFallbackHero = (answers) => {
  // Simple algorithm to select a hero based on the first answer
  // In a real app, you'd want a more sophisticated matching algorithm
  const firstAnswer = answers[0]?.toLowerCase() || '';

  if (firstAnswer.includes('intelligence') || firstAnswer.includes('strategy') || firstAnswer.includes('technology')) {
    return fallbackHeroes[0]; // Iron Man
  } else if (firstAnswer.includes('team') || firstAnswer.includes('leadership')) {
    return fallbackHeroes[1]; // Wonder Woman
  } else if (firstAnswer.includes('physical') || firstAnswer.includes('strength')) {
    return fallbackHeroes[2]; // Spider-Man
  } else {
    // Default or random selection
    return fallbackHeroes[Math.floor(Math.random() * fallbackHeroes.length)];
  }
};

const PersonalityQuiz = ({ onClose, addToCollection }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showUnlockCard, setShowUnlockCard] = useState(false);
  const { t, i18n } = useTranslation();

  // Try to resolve a canonical hero from the Superhero API by name
  const resolveHeroFromAPI = async (name) => {
    try {
      if (!name) return null;
      const resp = await axios.get(`/api/search?query=${encodeURIComponent(name)}`);
      if (resp?.data?.response === 'success' && Array.isArray(resp.data.results)) {
        // Prefer exact name match; fall back to first result
        const exact = resp.data.results.find(h => (h.name || '').toLowerCase() === name.toLowerCase());
        return exact || resp.data.results[0] || null;
      }
    } catch (e) {
      console.error('resolveHeroFromAPI error:', e);
    }
    return null;
  };

  // Build hero card-compatible object, preferring canonical API data for stable IDs/images
  const buildHeroData = async ({ name, image_url, publisher, powers = [], reason = '' }) => {
    // Try fetch from API to obtain numeric id and official image
    const apiHero = await resolveHeroFromAPI(name);
    if (apiHero) {
      return {
        id: apiHero.id,
        name: apiHero.name,
        image: { url: apiHero.image?.url || image_url || '' },
        biography: { publisher: apiHero.biography?.publisher || publisher || 'Unknown' },
        powerstats: apiHero.powerstats || {},
        powers,
        reason,
      };
    }
    // Fallback if API resolution fails
    return {
      id: Date.now().toString(),
      name,
      image: { url: image_url || '' },
      biography: { publisher: publisher || 'Unknown' },
      powerstats: {},
      powers,
      reason,
    };
  };

  // Expanded question pool
  const allQuestions = [
    // Original questions
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
    },
    // New questions
    {
      en: "How do you prefer to dress?",
      fr: "Comment préférez-vous vous habiller?",
      options: {
        en: ["Practical and functional", "Bold and colorful", "Elegant and stylish", "Casual and comfortable"],
        fr: ["Pratique et fonctionnel", "Audacieux et coloré", "Élégant et stylé", "Décontracté et confortable"]
      }
    },
    {
      en: "What would be your ideal superpower?",
      fr: "Quel serait votre super-pouvoir idéal?",
      options: {
        en: ["Super strength", "Mind control/telepathy", "Flight", "Invisibility"],
        fr: ["Super force", "Contrôle mental/télépathie", "Vol", "Invisibilité"]
      }
    },
    {
      en: "How do you handle conflict?",
      fr: "Comment gérez-vous les conflits?",
      options: {
        en: ["Face it head-on", "Find a diplomatic solution", "Analyze and strategize", "Avoid it if possible"],
        fr: ["L'affronter directement", "Trouver une solution diplomatique", "Analyser et élaborer une stratégie", "L'éviter si possible"]
      }
    },
    {
      en: "What's your preferred environment?",
      fr: "Quel est votre environnement préféré?",
      options: {
        en: ["Urban cityscape", "Natural wilderness", "High-tech laboratory", "Peaceful sanctuary"],
        fr: ["Paysage urbain", "Nature sauvage", "Laboratoire high-tech", "Sanctuaire paisible"]
      }
    },
    {
      en: "How do you view rules and laws?",
      fr: "Comment voyez-vous les règles et les lois?",
      options: {
        en: ["They must be followed strictly", "Guidelines that can be bent when necessary", "Necessary for society but can be flawed", "Restrictive and limiting"],
        fr: ["Elles doivent être suivies strictement", "Des lignes directrices qui peuvent être contournées si nécessaire", "Nécessaires pour la société mais parfois imparfaites", "Restrictives et limitantes"]
      }
    },
    {
      en: "What's your approach to danger?",
      fr: "Quelle est votre approche face au danger?",
      options: {
        en: ["Rush in to help", "Carefully assess the situation first", "Protect others before yourself", "Find an innovative solution"],
        fr: ["Se précipiter pour aider", "Évaluer soigneusement la situation d'abord", "Protéger les autres avant vous-même", "Trouver une solution innovante"]
      }
    },
    {
      en: "What do you value most in relationships?",
      fr: "Qu'est-ce que vous valorisez le plus dans les relations?",
      options: {
        en: ["Loyalty and trust", "Independence and space", "Communication and honesty", "Support and encouragement"],
        fr: ["Loyauté et confiance", "Indépendance et espace", "Communication et honnêteté", "Soutien et encouragement"]
      }
    },
    {
      en: "How do you spend your free time?",
      fr: "Comment passez-vous votre temps libre?",
      options: {
        en: ["Physical training or sports", "Reading or studying", "Helping others or volunteering", "Creating or inventing"],
        fr: ["Entraînement physique ou sports", "Lecture ou étude", "Aider les autres ou faire du bénévolat", "Créer ou inventer"]
      }
    }
  ];

  // Randomly select 5 questions from the pool
  const [questions, setQuestions] = useState(() => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5); // Get 5 random questions
  });

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
      if (!apiKey) {
        // Use fallback if no API key is available
        console.log('No API key available, using fallback hero');
        useFallbackHero(finalAnswers);
        return;
      }

      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a superhero expert. Based on the user's answers, suggest a superhero that matches their personality. Respond in ${i18n.language === 'fr' ? 'French' : 'English'} with a JSON object containing: name (string), reason (string explaining why this hero matches), publisher (string - e.g. "Marvel Comics", "DC Comics"), image_url (string - a placeholder URL for the hero's image, use "https://www.superherodb.com/pictures2/portraits/10/100/{id}.jpg" where {id} is a number between 1-1000 that might represent the hero), powers (array of strings - list of 3-5 main powers or abilities).`
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

        // Prefer canonical hero from API to get stable id and image
        const heroData = await buildHeroData({
          name: match.name,
          image_url: match.image_url,
          publisher: match.publisher,
          powers: match.powers || [],
          reason: match.reason,
        });

        setResult(heroData);

        // Add the hero to the collection if addToCollection function is provided
        if (addToCollection) {
          addToCollection(heroData, 'personalityQuiz'); // Specify the source as personalityQuiz
        }

        // Show the unlock card
        setShowUnlockCard(true);
      } catch (apiErr) {
        console.error('API call failed, using fallback hero:', apiErr);
        // If the API call fails, use the fallback hero
        useFallbackHero(finalAnswers);
      }
    } catch (err) {
      console.error('Error finding match:', err);

      // Provide more specific error messages
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('API Error Response:', err.response.data);
        setError(`${t('apiError')}: ${err.response.status} - ${err.response.data?.error?.message || t('noInformation')}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setError(t('networkError'));
      } else if (err.message && err.message.includes('JSON')) {
        // Error parsing JSON
        console.error('JSON parsing error:', err.message);
        setError(t('responseFormatError'));
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', err.message);
        setError(t('noInformation'));
      }
    }
    setLoading(false);
  };

  // Helper function to use a fallback hero
  const useFallbackHero = async (finalAnswers) => {
    const fallbackHero = getFallbackHero(finalAnswers);

    buildHeroData({
      name: fallbackHero.name,
      image_url: fallbackHero.image_url,
      publisher: fallbackHero.publisher,
      powers: fallbackHero.powers || [],
      reason: fallbackHero.reason,
    }).then((heroData) => {
      setResult(heroData);
      if (addToCollection) {
        addToCollection(heroData, 'personalityQuiz');
      }
      setShowUnlockCard(true);
    });
  };

  const handlePlayAgain = () => {
    // Reset state
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setError(null);

    // Select a new set of random questions
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5));
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
      {showUnlockCard && result && (
        <HeroUnlockCard
          hero={result}
          onClose={() => setShowUnlockCard(false)}
        />
      )}

      {!showUnlockCard && (
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

            <div className="mb-6 max-w-[240px] mx-auto">
              <HeroCard
                hero={result}
                handleSelectHero={() => {}}
                toggleFavorite={() => {}}
                favorites={[]}
              />
            </div>

            <div className="mb-6 p-4 bg-gray-100 rounded-lg border-2 border-black">
              <p>{result.reason}</p>

              {result.powers && result.powers.length > 0 && (
                <div className="mt-4">
                  <p className="font-bold mb-2">{t('powers')}:</p>
                  <ul className="flex flex-wrap gap-2 justify-center">
                    {result.powers.map((power, index) => (
                      <li key={index} className="bg-yellow-400 px-3 py-1 rounded-full text-sm border border-black">
                        {power}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

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
      )}
    </div>
  );
};

export default PersonalityQuiz;
