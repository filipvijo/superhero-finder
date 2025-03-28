import { motion } from 'framer-motion';

const HeroDetails = ({ hero, onClose }) => {
  if (!hero) return null;

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
        className="bg-white rounded-lg max-w-4xl w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* Hero Image */}
          <div className="relative h-96 md:h-full">
            <img
              src={hero.image.url}
              alt={hero.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Hero Info */}
          <div className="p-6 overflow-y-auto max-h-[600px]">
            <h2 className="text-4xl font-bangers mb-6 text-center" style={{ letterSpacing: '2px' }}>
              {hero.name}
            </h2>

            {/* Power Stats */}
            <div className="mb-6">
              <h3 className="text-2xl font-bangers mb-3" style={{ letterSpacing: '1px' }}>POWER STATS</h3>
              <div className="space-y-2">
                {Object.entries(hero.powerstats).map(([stat, value]) => (
                  <div key={stat} className="flex items-center">
                    <span className="font-bangers w-32 text-gray-600" style={{ letterSpacing: '1px' }}>
                      {stat.toUpperCase()}:
                    </span>
                    <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="ml-2 font-bold">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Biography */}
            <div className="mb-6">
              <h3 className="text-2xl font-bangers mb-3" style={{ letterSpacing: '1px' }}>BIOGRAPHY</h3>
              <div className="space-y-2">
                <p><span className="font-bangers text-gray-600">FULL NAME:</span> {hero.biography['full-name']}</p>
                <p><span className="font-bangers text-gray-600">ALTER EGOS:</span> {hero.biography['alter-egos']}</p>
                <p><span className="font-bangers text-gray-600">PUBLISHER:</span> {hero.biography.publisher}</p>
                <p><span className="font-bangers text-gray-600">ALIGNMENT:</span> {hero.biography.alignment}</p>
              </div>
            </div>

            {/* Appearance */}
            <div className="mb-6">
              <h3 className="text-2xl font-bangers mb-3" style={{ letterSpacing: '1px' }}>APPEARANCE</h3>
              <div className="space-y-2">
                <p><span className="font-bangers text-gray-600">RACE:</span> {hero.appearance.race}</p>
                <p><span className="font-bangers text-gray-600">HEIGHT:</span> {hero.appearance.height[1]}</p>
                <p><span className="font-bangers text-gray-600">WEIGHT:</span> {hero.appearance.weight[1]}</p>
                <p><span className="font-bangers text-gray-600">EYE COLOR:</span> {hero.appearance['eye-color']}</p>
                <p><span className="font-bangers text-gray-600">HAIR COLOR:</span> {hero.appearance['hair-color']}</p>
              </div>
            </div>

            {/* Work */}
            <div className="mb-6">
              <h3 className="text-2xl font-bangers mb-3" style={{ letterSpacing: '1px' }}>WORK</h3>
              <div className="space-y-2">
                <p><span className="font-bangers text-gray-600">OCCUPATION:</span> {hero.work.occupation}</p>
                <p><span className="font-bangers text-gray-600">BASE:</span> {hero.work.base}</p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-red-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
              style={{ letterSpacing: '1px' }}
            >
              CLOSE
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroDetails;