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
    <div className="relative h-64">
      <img
        src={hero.image.url}
        alt={hero.name}
        className="w-full h-full object-cover"
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
        {isFavorite ? '★' : '☆'}
      </button>
    </div>
    <div className="p-4 bg-gradient-to-b from-white to-gray-100">
      <h3 className="text-xl font-bangers text-center mb-2" style={{ letterSpacing: '1px' }}>{hero.name}</h3>
      <div className="text-sm space-y-1 font-bold">
        <p className="flex justify-between">
          <span className="text-gray-600">PUBLISHER:</span>
          <span>{hero.biography.publisher || 'Unknown'}</span>
        </p>
        <p className="flex justify-between">
          <span className="text-gray-600">ALIGNMENT:</span>
          <span>{hero.biography.alignment || 'Unknown'}</span>
        </p>
      </div>
    </div>
  </motion.div>
);

export default HeroCard;
