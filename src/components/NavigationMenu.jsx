import { motion } from 'framer-motion';
import { FaGamepad, FaStar, FaDragon, FaUserAstronaut } from 'react-icons/fa';

const NavigationMenu = ({
  setShowGuessHero,
  setShowBattle,
  setShowPersonalityQuiz,
  favoritesCount
}) => {
  const buttons = [
    {
      label: 'Guess the Hero',
      icon: <FaGamepad className="w-5 h-5" />,
      onClick: () => setShowGuessHero(true),
      className: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      label: `Collection (${favoritesCount})`,
      icon: <FaStar className="w-5 h-5" />,
      onClick: () => setShowCollection(true),
      className: 'bg-yellow-600 hover:bg-yellow-700'
    },
    {
      label: 'Battle',
      icon: <FaDragon className="w-5 h-5" />,
      onClick: () => setShowBattle(true),
      className: 'bg-red-600 hover:bg-red-700'
    },
    {
      label: 'Personality Quiz',
      icon: <FaUserAstronaut className="w-5 h-5" />,
      onClick: () => setShowPersonalityQuiz(true),
      className: 'bg-pink-600 hover:bg-pink-700'
    }
  ];

  return (
    <nav className="navigation-menu mb-6">
      <div className="flex flex-wrap justify-center gap-4">
        {buttons.map((button, index) => (
          <motion.button
            key={index}
            onClick={button.onClick}
            className={`nav-button ${button.className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {button.icon}
            <span className="ml-2">{button.label}</span>
          </motion.button>
        ))}
      </div>
    </nav>
  );
};

export default NavigationMenu;
