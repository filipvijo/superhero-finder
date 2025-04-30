import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css'; // Optional: Import default blur effect

const HeroCard = React.memo(({ hero, handleSelectHero, toggleFavorite, favorites }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key={hero.id}
      layoutId={`hero-${hero.id}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleSelectHero(hero)}
      className="bg-black/80 backdrop-blur-sm rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden cursor-pointer group relative"
    >
      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(hero);
          console.log('Star clicked for:', hero.name);
        }}
        className="absolute top-2 right-2 z-10 p-1 text-2xl bg-black/50 hover:bg-black/70 rounded-full transition-colors"
      >
        {favorites && favorites.some(f => f.id === hero.id) ? '⭐' : '☆'}
      </motion.button>
      <div className="relative aspect-[2/3]">
        <LazyLoadImage
          src={hero.image?.url || '/placeholder.jpg'}
          alt={hero.name}
          className="w-full h-full object-cover"
          effect="blur" // Optional: Apply blur effect during loading
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent group-hover:from-black/90 transition-all" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bangers text-white mb-1" style={{ letterSpacing: '1px' }}>
            {hero.name}
          </h3>
          <p className="text-sm text-gray-300">
            {hero.biography?.publisher || t('unknownPublisher')}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

export default HeroCard;
