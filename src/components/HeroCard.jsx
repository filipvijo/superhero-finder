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
    } rounded-xl overflow-hidden shadow-lg backdrop-blur-md transition-transform`}
  >
    <Tilt options={{ max: 25, scale: 1.02 }}>
      <div className="p-4">
        <img
          src={hero.image.url}
          alt={hero.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder.jpg';
          }}
        />
        <h3 className="text-xl font-bold mb-2">{hero.name}</h3>
        <p className="text-sm mb-2">Publisher: {hero.biography.publisher || 'Unknown'}</p>
        <p className="text-sm mb-4">Alignment: {hero.biography.alignment || 'Unknown'}</p>
        
        <div className="flex justify-between items-center">
          <button
            onClick={() => handleSelectHero(hero)}
            className={`btn-primary ${
              selectedHeroes.includes(hero)
                ? 'bg-red-500 hover:bg-red-600'
                : ''
            }`}
          >
            {selectedHeroes.includes(hero) ? 'Deselect' : 'Select'}
          </button>
          <button
            onClick={() => toggleFavorite(hero)}
            className={`icon-button ${
              favorites.some(fav => fav.id === hero.id)
                ? 'favorite-active'
                : 'favorite-inactive'
            }`}
          >
            <FaStar size={20} />
          </button>
        </div>
      </div>
    </Tilt>
  </motion.div>
);

export default HeroCard;
