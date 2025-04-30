import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const Navigation = ({ showingHome, setShowingHome, showFavorites, setShowFavorites, showCollection, setShowCollection, setShowCombatJournal }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, logout } = useAuth();
  console.log('Current user:', user);
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleLanguageToggle = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  };

  const handleHomeClick = () => {
    // Refresh the page completely
    window.location.reload();
  };

  const handleFavoritesClick = () => {
    setShowingHome(false);
    setShowFavorites(true);
  };

  const handleCollectionClick = () => {
    setShowingHome(false);
    setShowFavorites(false);
    setShowCollection(true);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b-4 border-black z-40 px-4 hidden md:block">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleHomeClick}
                className={`px-4 py-2 font-bangers text-lg ${
                  showingHome ? 'bg-yellow-400' : 'bg-white'
                } rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all`}
                style={{ letterSpacing: '1px' }}
              >
                {t('home')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFavoritesClick}
                className={`px-4 py-2 font-bangers text-lg ${
                  showFavorites ? 'bg-yellow-400' : 'bg-white'
                } rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all`}
                style={{ letterSpacing: '1px' }}
              >
                {t('favorites')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCollectionClick}
                className={`px-4 py-2 font-bangers text-lg ${
                  !showingHome && !showFavorites ? 'bg-yellow-400' : 'bg-white'
                } rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all`}
                style={{ letterSpacing: '1px' }}
              >
                {t('collection')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCombatJournal(true)} // Open the journal
                className="px-4 py-2 font-bangers text-lg bg-green-600 text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ letterSpacing: '1px' }}
              >
                {t('combatJournalNav')}
              </motion.button>
            </div>

            <div className="flex items-center gap-4">
              {!user && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 font-bangers text-lg bg-green-500 text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ letterSpacing: '1px' }}
                >
                  {t('signIn')}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black z-40 px-4 md:hidden">
        <div className="container mx-auto">
          <div className="flex items-center justify-around py-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleHomeClick}
              className={`px-4 py-2 font-bangers text-lg ${
                showingHome ? 'bg-yellow-400' : 'bg-white'
              } rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all`}
              style={{ letterSpacing: '1px' }}
            >
              {t('home')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFavoritesClick}
              className={`px-4 py-2 font-bangers text-lg ${
                showFavorites ? 'bg-yellow-400' : 'bg-white'
              } rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all`}
              style={{ letterSpacing: '1px' }}
            >
              {t('favorites')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCollectionClick}
              className={`px-4 py-2 font-bangers text-lg ${
                !showingHome && !showFavorites ? 'bg-yellow-400' : 'bg-white'
              } rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all`}
              style={{ letterSpacing: '1px' }}
            >
              {t('collection')}
            </motion.button>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLanguageToggle}
                className="px-4 py-2 font-bangers text-lg bg-blue-500 text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ letterSpacing: '1px' }}
              >
                {i18n.language === 'en' ? 'FR' : 'EN'}
              </motion.button>
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 font-bangers text-lg bg-red-500 text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ letterSpacing: '1px' }}
                >
                  {t('logout')}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 font-bangers text-lg bg-green-500 text-white rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  style={{ letterSpacing: '1px' }}
                >
                  {t('signIn')}
                </motion.button>
              )}
            </div>
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
