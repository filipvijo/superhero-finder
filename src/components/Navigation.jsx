import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const Navigation = ({ showFavorites, setShowFavorites, showCollection, setShowCollection, setShowingHome }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { currentUser, logout } = useAuth();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleShowFavorites = () => {
    setShowFavorites(true);
    setShowCollection(false);
    setShowingHome(false);
  };

  const handleShowCollection = () => {
    setShowCollection(true);
    setShowFavorites(false);
    setShowingHome(false);
  };

  const handleShowHome = () => {
    setShowingHome(true);
    setShowFavorites(false);
    setShowCollection(false);
  };

  return (
    <nav className="bg-black/80 backdrop-blur-sm fixed top-0 left-0 right-0 p-4 flex items-center justify-between z-50 border-b-4 border-black shadow-lg">
      {/* Left side - Home button and Language Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleShowHome}
          className="px-4 py-2 bg-yellow-400 text-black font-bangers rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          style={{ letterSpacing: '1px' }}
        >
          HOME
        </button>
        <button
          onClick={toggleLanguage}
          className="px-3 py-1 bg-white/90 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
        >
          <span className="text-xl">
            {i18n.language === 'en' ? '🇬🇧' : '🇫🇷'}
          </span>
          <span className="font-medium">
            {i18n.language === 'en' ? 'FR' : 'EN'}
          </span>
        </button>
      </div>

      {/* Center - Collection and Favorites */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleShowCollection}
          className={`px-4 py-2 ${showCollection ? 'bg-purple-600' : 'bg-purple-500'} text-white font-bangers rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all`}
          style={{ letterSpacing: '1px' }}
        >
          COLLECTION
        </button>
        <button
          onClick={handleShowFavorites}
          className={`px-4 py-2 ${showFavorites ? 'bg-red-600' : 'bg-red-500'} text-white font-bangers rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all`}
          style={{ letterSpacing: '1px' }}
        >
          FAVORITES
        </button>
      </div>

      {/* Right side - Auth */}
      <div className="flex items-center gap-4">
        {currentUser ? (
          <div className="flex items-center gap-2">
            <span className="text-white bg-black/50 px-3 py-1 rounded-lg">
              {currentUser.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white font-bangers rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              style={{ letterSpacing: '1px' }}
            >
              {t('logout')}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white font-bangers rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            style={{ letterSpacing: '1px' }}
          >
            {t('signIn')}
          </button>
        )}

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    </nav>
  );
};

export default Navigation;
