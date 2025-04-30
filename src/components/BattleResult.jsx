import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { getOptimizedImageUrl, getResponsiveImageSize } from '../utils/imageOptimizer';

/**
 * Component to display battle results
 * @param {Object} props - Component props
 * @returns {JSX.Element} Battle result component
 */
const BattleResult = ({ fightText, fightImage, winnerHero, onNewBattle }) => {
  const { t } = useTranslation();

  // Get appropriate image size based on device
  const imageSize = useMemo(() => getResponsiveImageSize(), []);

  return (
    <div className="space-y-6">
      {winnerHero && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="inline-block p-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-xl"
        >
          <div className="bg-white p-2 rounded">
            <img
              src={getOptimizedImageUrl(winnerHero.image.url, { width: imageSize * 1.5, quality: 90 })}
              alt={winnerHero.name}
              className="w-32 h-48 object-cover rounded mx-auto mb-2"
              loading="lazy"
            />
            <p className="font-bangers text-xl text-center">
              {t('winner')}: {winnerHero.name}
            </p>
          </div>
        </motion.div>
      )}

      {fightText && (
        <div className="text-lg italic bg-yellow-100 p-4 rounded border-2 border-black shadow-inner font-sans leading-relaxed text-left space-y-3">
          {fightText.split('\n').map((paragraph, index) => (
            paragraph.trim() && (
              <p key={index} className="mb-3">{paragraph}</p>
            )
          ))}
        </div>
      )}

      {fightImage && (
        <div className="mt-4">
          <h3 className="text-xl font-bangers mb-2">{t('battleScene')}</h3>
          <img
            src={fightImage}
            alt={t('fightSceneAlt')}
            className="max-w-full md:max-w-md mx-auto rounded border-2 border-black shadow-md"
            loading="lazy"
            width={imageSize * 3}
            height={imageSize * 2}
          />
        </div>
      )}

      <div className="text-center mt-8">
        <button
          onClick={onNewBattle}
          className="px-6 py-2 bg-blue-500 text-white rounded border-2 border-black hover:bg-blue-600 transition-colors"
        >
          {t('newBattle')}
        </button>
      </div>
    </div>
  );
};

BattleResult.propTypes = {
  fightText: PropTypes.string.isRequired,
  fightImage: PropTypes.string,
  winnerHero: PropTypes.object,
  onNewBattle: PropTypes.func.isRequired
};

export default BattleResult;
