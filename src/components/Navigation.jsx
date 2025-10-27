import { useState, Fragment } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const Navigation = ({ showingHome, setShowingHome, showFavorites, setShowFavorites, showCollection, setShowCollection, setShowCombatJournal }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, logout } = useAuth();
  console.log('Current user:', user);
  const { t, i18n } = useTranslation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

      {/* Mobile Top Bar with Hamburger */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b-4 border-black z-40 px-4 md:hidden">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => setShowMobileMenu(true)}
              className="p-2 border-2 border-black rounded-lg bg-yellow-400"
              aria-label="Open menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <button
              onClick={handleHomeClick}
              className="px-3 py-1 font-bangers text-base bg-white rounded-lg border-2 border-black"
              style={{ letterSpacing: '1px' }}
            >
              {t('home')}
            </button>
            <span className="w-6" />
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Transition show={showMobileMenu} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={() => setShowMobileMenu(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 flex justify-end">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-200" enterFrom="translate-x-full" enterTo="translate-x-0"
                leave="transform transition ease-in duration-150" leaveFrom="translate-x-0" leaveTo="translate-x-full"
              >
                <Dialog.Panel className="w-80 max-w-full h-full bg-white border-l-4 border-black shadow-[8px_0_0_0_rgba(0,0,0,1)] p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title className="font-bangers text-2xl" style={{ letterSpacing: '1px' }}>
                      Menu
                    </Dialog.Title>
                    <button
                      onClick={() => setShowMobileMenu(false)}
                      className="p-2 border-2 border-black rounded-lg"
                      aria-label="Close menu"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {user && (
                      <div className="px-3 py-2 border-2 border-black rounded-lg bg-yellow-100 font-bangers" style={{ letterSpacing: '1px' }}>
                        {user.email}
                      </div>
                    )}
                    <button
                      onClick={() => { setShowMobileMenu(false); handleHomeClick(); }}
                      className="w-full px-4 py-2 text-left font-bangers border-2 border-black rounded-lg hover:bg-yellow-100"
                    >{t('home')}</button>

                    <button
                      onClick={() => { setShowMobileMenu(false); handleFavoritesClick(); }}
                      className="w-full px-4 py-2 text-left font-bangers border-2 border-black rounded-lg hover:bg-yellow-100"
                    >{t('favorites')}</button>

                    <button
                      onClick={() => { setShowMobileMenu(false); handleCollectionClick(); }}
                      className="w-full px-4 py-2 text-left font-bangers border-2 border-black rounded-lg hover:bg-yellow-100"
                    >{t('collection')}</button>

                    <button
                      onClick={() => { setShowMobileMenu(false); setShowCombatJournal(true); }}
                      className="w-full px-4 py-2 text-left font-bangers border-2 border-black rounded-lg hover:bg-yellow-100"
                    >{t('combatJournalNav')}</button>

                    <div className="pt-2 border-t-2 border-black/20 mt-2 space-y-2">
                      <button
                        onClick={() => { setShowMobileMenu(false); handleLanguageToggle(); }}
                        className="w-full px-4 py-2 text-left font-bangers bg-blue-500 text-white border-2 border-black rounded-lg"
                      >{i18n.language === 'en' ? 'FR' : 'EN'}</button>

                      {!user ? (
                        <button
                          onClick={() => { setShowMobileMenu(false); setShowAuthModal(true); }}
                          className="w-full px-4 py-2 text-left font-bangers bg-green-500 text-white border-2 border-black rounded-lg"
                        >{t('signIn')}</button>
                      ) : (
                        <button
                          onClick={async () => { await handleLogout(); setShowMobileMenu(false); }}
                          className="w-full px-4 py-2 text-left font-bangers bg-red-500 text-white border-2 border-black rounded-lg"
                        >{t('logout')}</button>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
};

export default Navigation;
