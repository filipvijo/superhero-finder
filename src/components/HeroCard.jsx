import { motion } from "framer-motion";
import { Tilt } from "react-tilt";
import { FaStar } from "react-icons/fa";

const animations = {
  cardVariants: {
    hidden: { opacity: 0, y: 50 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1, ease: "easeOut", type: "spring", stiffness: 100 },
    }),
    hover: { scale: 1.05, rotate: 2, boxShadow: "0 12px 30px rgba(0, 0, 0, 0.7)", transition: { duration: 0.3 } },
    tap: { scale: 0.95, rotate: -2, transition: { duration: 0.2 } },
  },
};

const HeroCard = ({ hero, index, handleSelectHero, selectedHeroes, toggleFavorite, favorites, theme }) => (
  <motion.div
    variants={animations.cardVariants}
    initial="hidden"
    animate="visible"
    whileHover="hover"
    whileTap="tap"
    custom={index}
    className={`hero-card relative ${
      theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'
    } rounded-xl overflow-hidden shadow-lg backdrop-blur-md transition-transform h-[500px] flex flex-col`}
  >
    <Tilt options={{ max: 25, scale: 1.02 }}>
      <div className="relative h-full p-4 flex flex-col">
        <div className="relative flex-grow mb-4" style={{ minHeight: '300px' }}>
          <img
            src={hero.image.url}
            alt={hero.name}
            className="absolute inset-0 w-full h-full object-contain rounded-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder.jpg';
            }}
          />
        </div>
        <div className="flex-none">
          <h3 className="text-xl font-bold mb-2 truncate">{hero.name}</h3>
          <p className="text-sm mb-2 truncate">Publisher: {hero.biography.publisher || 'Unknown'}</p>
          <p className="text-sm mb-4 truncate">Alignment: {hero.biography.alignment || 'Unknown'}</p>
          
          <div className="flex justify-between items-center">
            <button
              onClick={() => handleSelectHero(hero)}
              className={`btn-primary ${
                selectedHeroes.includes(hero)
                  ? 'bg-red-500 hover:bg-red-600'
                  : ''
              }`}
            >
              View Details
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(hero);
              }}
              className="text-2xl transform transition-transform hover:scale-110"
            >
              {favorites.some((fav) => fav.id === hero.id) ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
      </div>
    </Tilt>
  </motion.div>
);

export default HeroCard;
