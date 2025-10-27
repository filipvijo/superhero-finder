import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { getHeroImageUrl, getAkababImageUrl } from '../utils/imageOptimizer';

/**
 * Component to display when a user unlocks a new hero personality
 * Shows a celebratory animation and hero card
 */
const HeroUnlockCard = ({ hero, onClose }) => {
  const { t } = useTranslation();

  // No confetti effect for this component

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        className="bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 p-6 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-2">
          <div></div> {/* Empty div for flex spacing */}
          <button
            onClick={onClose}
            className="text-2xl hover:text-red-500 font-bold"
            aria-label={t('close')}
          >
            &times;
          </button>
        </div>
        <div className="text-center mb-4">
          <motion.h2
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.2, 1] }}
            transition={{ times: [0, 0.5, 1], duration: 0.8 }}
            className="text-3xl font-bangers text-black mb-2"
            style={{ letterSpacing: '1px', textShadow: '2px 2px 0px white' }}
          >
            {t('heroUnlocked')}!
          </motion.h2>
          <p className="text-lg font-bold">{t('youUnlockedHero')}</p>
        </div>

        <motion.div
          className="relative mx-auto mb-6 max-w-[280px]"
          initial={{ rotateY: 180 }}
          animate={{ rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="bg-black/80 backdrop-blur-sm rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
            <div className="absolute inset-0 bg-yellow-500 opacity-20 z-0"></div>
            <div className="relative aspect-[2/3] z-10">
              <LazyLoadImage
                src={getHeroImageUrl(hero)}
                alt={hero.name}
                className="w-full h-full object-cover"
                effect="blur"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getAkababImageUrl(hero);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-2xl font-bangers text-white mb-1" style={{ letterSpacing: '1px' }}>
                  {hero.name}
                </h3>
                <p className="text-sm text-gray-300">
                  {hero.biography?.publisher || t('unknownPublisher')}
                </p>
              </div>
            </div>
          </div>

          <motion.div
            className="absolute -top-4 -right-4 w-24 h-24 bg-red-600 rounded-full flex items-center justify-center transform rotate-12 border-4 border-black shadow-lg"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 12 }}
            transition={{ delay: 0.6, type: "spring" }}
          >
            <span className="text-white font-bangers text-xl" style={{ letterSpacing: '1px' }}>
              {t('newHero')}!
            </span>
          </motion.div>
        </motion.div>

        <div className="bg-white p-4 rounded-lg border-2 border-black mb-4">
          <p className="text-sm mb-3">{hero.reason}</p>

          {hero.powers && hero.powers.length > 0 && (
            <div>
              <p className="font-bold text-sm mb-2">{t('powers')}:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {hero.powers.map((power, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + (index * 0.1) }}
                    className="bg-yellow-400 px-3 py-1 rounded-full text-xs border border-black inline-block"
                  >
                    {power}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-6 py-2 bg-red-500 text-white font-bangers rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            style={{ letterSpacing: '1px' }}
          >
            {t('awesome')}!
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroUnlockCard;
