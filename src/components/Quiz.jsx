import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Quiz = ({ heroes, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (heroes.length >= 4) {
      const generatedQuestions = generateQuestions(heroes);
      setQuestions(generatedQuestions);
    }
  }, [heroes]);

  const generateQuestions = (heroes) => {
    const questions = [];
    const usedHeroes = new Set();

    // Generate different types of questions
    const questionTypes = [
      generatePowerQuestion,
      generatePublisherQuestion,
      generateAlignmentQuestion,
      generateAppearanceQuestion
    ];

    for (let i = 0; i < 10 && heroes.length >= 4; i++) {
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      const question = questionType(heroes, usedHeroes);
      if (question) {
        questions.push(question);
      }
    }

    return questions;
  };

  const generatePowerQuestion = (heroes, usedHeroes) => {
    const availableHeroes = heroes.filter(h => !usedHeroes.has(h.id));
    if (availableHeroes.length < 4) return null;

    const correctHero = availableHeroes[Math.floor(Math.random() * availableHeroes.length)];
    usedHeroes.add(correctHero.id);

    const powers = ['strength', 'speed', 'intelligence', 'power'];
    const selectedPower = powers[Math.floor(Math.random() * powers.length)];

    const options = [correctHero];
    while (options.length < 4) {
      const hero = availableHeroes[Math.floor(Math.random() * availableHeroes.length)];
      if (!options.includes(hero)) {
        options.push(hero);
      }
    }

    return {
      question: `Which hero has the highest ${selectedPower}?`,
      options: shuffleArray(options.map(h => h.name)),
      correct: correctHero.name,
      type: 'power'
    };
  };

  const generatePublisherQuestion = (heroes, usedHeroes) => {
    const availableHeroes = heroes.filter(h => !usedHeroes.has(h.id));
    if (availableHeroes.length < 4) return null;

    const hero = availableHeroes[Math.floor(Math.random() * availableHeroes.length)];
    usedHeroes.add(hero.id);

    const publishers = ['Marvel Comics', 'DC Comics', 'Dark Horse Comics', 'Image Comics'];
    const options = shuffleArray([...new Set([hero.biography.publisher, ...publishers])]).slice(0, 4);

    return {
      question: `Which publisher created ${hero.name}?`,
      options,
      correct: hero.biography.publisher,
      type: 'publisher'
    };
  };

  const generateAlignmentQuestion = (heroes, usedHeroes) => {
    const availableHeroes = heroes.filter(h => !usedHeroes.has(h.id));
    if (availableHeroes.length < 4) return null;

    const hero = availableHeroes[Math.floor(Math.random() * availableHeroes.length)];
    usedHeroes.add(hero.id);

    return {
      question: `What is ${hero.name}'s alignment?`,
      options: ['good', 'bad', 'neutral', 'unknown'],
      correct: hero.biography.alignment || 'unknown',
      type: 'alignment'
    };
  };

  const generateAppearanceQuestion = (heroes, usedHeroes) => {
    const availableHeroes = heroes.filter(h => !usedHeroes.has(h.id));
    if (availableHeroes.length < 4) return null;

    const hero = availableHeroes[Math.floor(Math.random() * availableHeroes.length)];
    usedHeroes.add(hero.id);

    const attributes = ['height', 'weight', 'eye-color', 'hair-color'];
    const attribute = attributes[Math.floor(Math.random() * attributes.length)];

    return {
      question: `What is ${hero.name}'s ${attribute}?`,
      options: shuffleArray([
        hero.appearance[attribute],
        ...availableHeroes
          .filter(h => h.id !== hero.id)
          .map(h => h.appearance[attribute])
          .slice(0, 3)
      ]),
      correct: hero.appearance[attribute],
      type: 'appearance'
    };
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleAnswerClick = (answer) => {
    if (answer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    const newQuestions = generateQuestions(heroes);
    setQuestions(newQuestions);
  };

  if (heroes.length < 4) {
    return (
      <div className="quiz-container">
        <h2 className="text-2xl font-bold mb-4">Superhero Quiz</h2>
        <p>Please search for more heroes to start the quiz (minimum 4 required).</p>
        <button onClick={onClose} className="btn-primary mt-4">
          Close
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="quiz-container max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
    >
      {showScore ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
          <p className="text-xl mb-4">
            You scored {score} out of {questions.length}
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={resetQuiz} className="btn-primary">
              Play Again
            </button>
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
          </div>
        </div>
      ) : questions.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Superhero Quiz</h2>
            <p>
              Question {currentQuestion + 1}/{questions.length}
            </p>
          </div>
          <div className="mb-6">
            <p className="text-xl mb-4">{questions[currentQuestion].question}</p>
            <div className="grid grid-cols-1 gap-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(option)}
                  className="btn-primary text-left p-4"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading questions...</p>
      )}
    </motion.div>
  );
};

export default Quiz;
