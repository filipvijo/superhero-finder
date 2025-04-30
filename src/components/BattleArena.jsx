import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { fal } from '@fal-ai/client';
import useHeroSearch from '../hooks/useHeroSearch';
import useBattleSimulation from '../hooks/useBattleSimulation';
import HeroSearch from './HeroSearch';
import BattleResult from './BattleResult';

// Configure fal.ai client with API key from environment variables
fal.config({
  credentials: import.meta.env.VITE_FAL_KEY,
});

/**
 * BattleArena component for superhero battles
 * @param {Object} props - Component props
 * @returns {JSX.Element} BattleArena component
 */
const BattleArena = ({ onClose }) => {
  const { t } = useTranslation();

  // Use custom hooks for hero search
  const hero1Search = useHeroSearch();
  const hero2Search = useHeroSearch();

  // Use custom hook for battle simulation
  const battle = useBattleSimulation();

  /**
   * Handle battle between selected heroes
   */
  const handleBattle = async () => {
    if (!hero1Search.selectedHero || !hero2Search.selectedHero) return;

    await battle.simulateBattle(
      hero1Search.selectedHero,
      hero2Search.selectedHero
    );
  };

  /**
   * Reset the battle and hero selections
   */
  const resetBattle = () => {
    hero1Search.resetSearch();
    hero2Search.resetSearch();
    battle.resetBattle();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 md:p-8 max-w-3xl w-full border-4 border-black shadow-lg overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bangers text-center flex-grow">{t('battleArena')}</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-red-500"
            aria-label={t('close')}
          >
            &times;
          </button>
        </div>

        {/* Show hero selection when not in battle */}
        {!battle.fightText && !battle.loadingBattle && !battle.errorBattle && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Hero 1 Search */}
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('hero')} 1</h3>
              <HeroSearch
                query={hero1Search.query}
                setQuery={hero1Search.setQuery}
                loading={hero1Search.loading}
                error={hero1Search.error}
                results={hero1Search.results}
                selectedHero={hero1Search.selectedHero}
                setSelectedHero={hero1Search.setSelectedHero}
                onSearch={hero1Search.searchHero}
                onSelectHero={hero1Search.selectHero}
                placeholder={t('searchHero1')}
              />
            </div>

            {/* Hero 2 Search */}
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('hero')} 2</h3>
              <HeroSearch
                query={hero2Search.query}
                setQuery={hero2Search.setQuery}
                loading={hero2Search.loading}
                error={hero2Search.error}
                results={hero2Search.results}
                selectedHero={hero2Search.selectedHero}
                setSelectedHero={hero2Search.setSelectedHero}
                onSearch={hero2Search.searchHero}
                onSelectHero={hero2Search.selectHero}
                placeholder={t('searchHero2')}
              />
            </div>
          </div>
        )}

        {/* Loading state */}
        {battle.loadingBattle && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mb-4"></div>
            <p className="text-lg font-bold">{t('generatingBattle')}...</p>
            <p className="text-sm text-gray-600 mt-2">
              {t('usingGPT4oMini')} {/* Add this translation key */}
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-150"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        )}

        {/* Error state */}
        {battle.errorBattle && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p className="font-semibold">{battle.errorBattle}</p>
          </div>
        )}

        {/* Battle results */}
        {battle.fightText && (
          <BattleResult
            fightText={battle.fightText}
            fightImage={battle.fightImage}
            winnerHero={battle.winnerHero}
            onNewBattle={resetBattle}
          />
        )}

        {/* Battle button */}
        <div className="text-center mt-8">
          {!battle.fightText && !battle.loadingBattle && !battle.errorBattle && (
            <button
              onClick={handleBattle}
              disabled={!hero1Search.selectedHero || !hero2Search.selectedHero || battle.loadingBattle}
              className="px-8 py-3 bg-gray-300 text-black font-bold rounded border-2 border-black shadow-md disabled:opacity-50 enabled:bg-red-500 enabled:text-white enabled:hover:bg-red-600 transition-colors"
              aria-label={t('startBattle')}
            >
              {t('startBattle')}
            </button>
          )}
          {battle.errorBattle && !battle.loadingBattle && (
            <button
              onClick={resetBattle}
              className="px-6 py-2 bg-blue-500 text-white rounded border-2 border-black hover:bg-blue-600 transition-colors"
              aria-label={t('tryAgain')}
            >
              {t('tryAgain')}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BattleArena;
