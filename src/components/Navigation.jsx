import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AuthModal from './AuthModal';

const Navigation = ({
  showFavorites,
  setShowFavorites,
  showCollection,
  setShowCollection,
  setShowingHome
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { t, i18n } = useTranslation();

  const handleLanguageToggle = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  };

  const handleHomeClick = () => {
    setShowFavorites(false);
    setShowCollection(false);
    setShowingHome(true);
  };

  const handleFavoritesClick = () => {
    setShowFavorites(true);
    setShowCollection(false);
    setShowingHome(false);
  };

  const handleCollectionClick = () => {
    setShowCollection(true);
    setShowFavorites(false);
    setShowingHome(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white border-b-4 border-black z-40 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleHomeClick}
                className={`px-4 py-2 font-bangers rounded-lg border-2 border-black transition-all ${
                  !showFavorites && !showCollection
                    ? 'bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white hover:bg-gray-100'
                }`}
                style={{ letterSpacing: '1px' }}
              >
                {t('home')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFavoritesClick}
                className={`px-4 py-2 font-bangers rounded-lg border-2 border-black transition-all ${
                  showFavorites
                    ? 'bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white hover:bg-gray-100'
                }`}
                style={{ letterSpacing: '1px' }}
              >
                {t('favorites')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCollectionClick}
                className={`px-4 py-2 font-bangers rounded-lg border-2 border-black transition-all ${
                  showCollection
                    ? 'bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white hover:bg-gray-100'
                }`}
                style={{ letterSpacing: '1px' }}
              >
                {t('collection')}
              </motion.button>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLanguageToggle}
                className="px-4 py-2 font-bangers bg-blue-500 text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ letterSpacing: '1px' }}
              >
                {i18n.language === 'en' ? 'FR' : 'EN'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 font-bangers bg-purple-500 text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ letterSpacing: '1px' }}
              >
                {t('signIn')}
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black z-40 px-4 md:hidden">
        <div className="container mx-auto">
          <div className="flex items-center justify-between py-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleHomeClick}
              className={`px-3 py-1 font-bangers text-sm rounded-lg border-2 border-black transition-all ${
                !showFavorites && !showCollection
                  ? 'bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white hover:bg-gray-100'
              }`}
              style={{ letterSpacing: '1px' }}
            >
              {t('home')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFavoritesClick}
              className={`px-3 py-1 font-bangers text-sm rounded-lg border-2 border-black transition-all ${
                showFavorites
                  ? 'bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white hover:bg-gray-100'
              }`}
              style={{ letterSpacing: '1px' }}
            >
              {t('favorites')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCollectionClick}
              className={`px-3 py-1 font-bangers text-sm rounded-lg border-2 border-black transition-all ${
                showCollection
                  ? 'bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white hover:bg-gray-100'
              }`}
              style={{ letterSpacing: '1px' }}
            >
              {t('collection')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLanguageToggle}
              className="px-3 py-1 font-bangers text-sm bg-blue-500 text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              style={{ letterSpacing: '1px' }}
            >
              {i18n.language === 'en' ? 'FR' : 'EN'}
            </motion.button>
          </div>
        </div>
      </nav>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
};

export default Navigation;
