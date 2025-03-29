import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const HeroCard = ({ hero, onClick, isFavorite, onToggleFavorite }) => (
  <motion.div
    layoutId={`hero-${hero.id}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.05 }}
    className="relative bg-white rounded-lg overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer transform transition-all hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
    onClick={onClick}
  >
    <div className="relative h-80">
      <img
        src={hero.image.url}
        alt={hero.name}
        className="w-full h-full object-contain bg-gradient-to-b from-gray-100 to-white"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/placeholder.jpg';
        }}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center bg-white rounded-full border-2 border-black font-bangers text-xl hover:bg-yellow-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
      >
        <FaStar className={isFavorite ? "text-yellow-400" : "text-gray-300"} />
      </button>
    </div>
    <div className="p-4 bg-gradient-to-b from-white to-gray-100">
      <h3 className="text-xl font-bangers text-center mb-4" style={{ letterSpacing: '1px' }}>{hero.name}</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600 font-bold mb-1">STATS</p>
          <div className="space-y-1">
            <p className="flex justify-between">
              <span>Intelligence:</span>
              <span>{hero.powerstats.intelligence}</span>
            </p>
            <p className="flex justify-between">
              <span>Strength:</span>
              <span>{hero.powerstats.strength}</span>
            </p>
            <p className="flex justify-between">
              <span>Speed:</span>
              <span>{hero.powerstats.speed}</span>
            </p>
          </div>
        </div>
        <div>
          <p className="text-gray-600 font-bold mb-1">INFO</p>
          <div className="space-y-1">
            <p className="flex justify-between">
              <span>Publisher:</span>
              <span>{hero.biography.publisher || 'Unknown'}</span>
            </p>
            <p className="flex justify-between">
              <span>Alignment:</span>
              <span className="capitalize">{hero.biography.alignment || 'Unknown'}</span>
            </p>
            <p className="flex justify-between">
              <span>Gender:</span>
              <span>{hero.appearance.gender || 'Unknown'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default HeroCard;
