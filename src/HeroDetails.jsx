import React from 'react';
import { motion } from 'framer-motion';
import MediaHub from './components/MediaHub';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { getHeroImageUrl, getAkababImageUrl } from './utils/imageOptimizer';
import 'react-lazy-load-image-component/src/effects/blur.css';

const HeroDetails = ({ hero, onClose, isFavorite, onFavoriteToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 overflow-y-auto z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        className="bg-white rounded-lg w-full max-w-4xl my-8 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
          <LazyLoadImage
            src={getHeroImageUrl(hero, { size: 'lg' })}
            alt={hero.name}
            className="w-full h-64 object-cover object-center"
            effect="blur"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getAkababImageUrl(hero, 'lg');
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-4xl font-bangers text-white mb-2" style={{ letterSpacing: '2px' }}>
                {hero.name}
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onFavoriteToggle}
                className="text-3xl transform transition-transform"
              >
                {isFavorite ? '❤️' : '🤍'}
              </motion.button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bangers" style={{ letterSpacing: '1px' }}>Powerstats</h3>
              {Object.entries(hero.powerstats).map(([stat, value]) => (
                <div key={stat} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{stat}</span>
                    <span>{value}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-xl font-bangers mb-4" style={{ letterSpacing: '1px' }}>Biography</h3>
              <div className="space-y-2">
                {Object.entries(hero.biography).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-sm font-medium capitalize">{key.replace('-', ' ')}: </span>
                    <span className="text-sm">{Array.isArray(value) ? value.join(', ') : value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bangers mb-4" style={{ letterSpacing: '1px' }}>Appearance</h3>
              <div className="space-y-2">
                {Object.entries(hero.appearance).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-sm font-medium capitalize">{key}: </span>
                    <span className="text-sm">{Array.isArray(value) ? value.join(', ') : value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <MediaHub hero={hero} />
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white font-bangers rounded-lg hover:bg-gray-800"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroDetails;
