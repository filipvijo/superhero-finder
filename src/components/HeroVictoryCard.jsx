import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { LazyLoadImage } from 'react-lazy-load-image-component';

/**
 * Component to display when a user correctly guesses a hero
 * Shows a celebratory animation and hero card
 */
const HeroVictoryCard = ({ hero, onClose, onPlayAgain }) => {
  const { t } = useTranslation();

  // Trigger confetti effect when component mounts
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min, max) => Math.random() * (max - min) + min;
    
    const confettiEffect = () => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) return;
      
      const particleCount = 50 * (timeLeft / duration);
      
      // Create confetti from both sides
      confetti({
        particleCount,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0.5, 0.7) },
        colors: ['#FFD700', '#FF0000', '#0000FF', '#00FF00', '#FF00FF'],
        shapes: ['circle', 'square'],
        gravity: randomInRange(0.4, 0.6),
        scalar: randomInRange(0.8, 1.2),
        drift: randomInRange(-0.4, 0.4),
      });
      
      confetti({
        particleCount,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0.5, 0.7) },
        colors: ['#FFD700', '#FF0000', '#0000FF', '#00FF00', '#FF00FF'],
        shapes: ['circle', 'square'],
        gravity: randomInRange(0.4, 0.6),
        scalar: randomInRange(0.8, 1.2),
        drift: randomInRange(-0.4, 0.4),
      });
      
      requestAnimationFrame(confettiEffect);
    };
    
    confettiEffect();
    
    return () => {
      // Clean up if needed
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="bg-gradient-to-br from-green-400 via-green-300 to-green-500 p-6 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full"
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
          {t('correctGuess')}
        </motion.h2>
        <p className="text-lg font-bold">{t('heroAddedToCollection')}</p>
      </div>

      <motion.div 
        className="relative mx-auto mb-6 max-w-[280px]"
        initial={{ rotateY: 180 }}
        animate={{ rotateY: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="bg-black/80 backdrop-blur-sm rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
          <div className="absolute inset-0 bg-green-500 opacity-20 z-0"></div>
          <div className="relative aspect-[2/3] z-10">
            <LazyLoadImage
              src={hero.image?.url || '/placeholder.jpg'}
              alt={hero.name}
              className="w-full h-full object-cover"
              effect="blur"
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
            {t('unlocked')}!
          </span>
        </motion.div>
      </motion.div>

      <div className="flex justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayAgain}
          className="px-6 py-2 bg-yellow-400 text-black font-bangers rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          style={{ letterSpacing: '1px' }}
        >
          {t('playAgain')}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="px-6 py-2 bg-gray-200 text-black font-bangers rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          style={{ letterSpacing: '1px' }}
        >
          {t('close')}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HeroVictoryCard;
