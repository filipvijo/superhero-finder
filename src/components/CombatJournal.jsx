import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getOptimizedImageUrl, getResponsiveImageSize } from '../utils/imageOptimizer';

const CombatJournal = ({ onClose }) => {
  const { t } = useTranslation();
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');
  const [filterWinner, setFilterWinner] = useState('all');

  // Get appropriate image size based on device
  const imageSize = useMemo(() => getResponsiveImageSize(), []);

  useEffect(() => {
    setLoading(true); // Set loading true at the start
    try {
      const rawData = localStorage.getItem('combatJournal'); // Get raw string
      console.log("Combat Journal - Raw data from localStorage:", rawData); // <-- Log the raw string

      const savedEntries = JSON.parse(rawData || '[]'); // Parse it
      console.log("Combat Journal - Parsed entries:", savedEntries); // <-- Log the parsed array

      setJournalEntries(savedEntries); // Set state
    } catch (error) {
      console.error("Error loading combat journal:", error);
      setJournalEntries([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  }, []); // Empty array means this runs only once

  // Get unique winners for filtering
  const winners = useMemo(() => {
    const uniqueWinners = [...new Set(journalEntries.map(entry => entry.winnerName))];
    return uniqueWinners;
  }, [journalEntries]);

  // Sort and filter entries
  const processedEntries = useMemo(() => {
    // First filter by winner
    const filtered = filterWinner === 'all'
      ? journalEntries
      : journalEntries.filter(entry => entry.winnerName === filterWinner);

    // Then sort
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.timestamp) - new Date(a.timestamp); // Newest first
        case 'winner':
          return a.winnerName.localeCompare(b.winnerName);
        case 'hero1':
          return a.hero1Name.localeCompare(b.hero1Name);
        case 'hero2':
          return a.hero2Name.localeCompare(b.hero2Name);
        default:
          return 0;
      }
    });
  }, [journalEntries, sortBy, filterWinner]);

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
        className="bg-gradient-to-b from-gray-100 to-gray-300 rounded-lg p-6 max-w-4xl w-full border-4 border-black shadow-lg overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
          <h2 className="text-3xl font-bangers" style={{ letterSpacing: '1px' }}>
            {t('combatJournalTitle') || "Combat Journal"}
          </h2>
          <button onClick={onClose} className="text-2xl hover:text-red-500">&times;</button>
        </div>

        {journalEntries.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-6">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border-2 border-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="date">{t('sortByDate') || "Sort by Date"}</option>
              <option value="winner">{t('sortByWinner') || "Sort by Winner"}</option>
              <option value="hero1">{t('sortByHero1') || "Sort by Hero 1"}</option>
              <option value="hero2">{t('sortByHero2') || "Sort by Hero 2"}</option>
            </select>

            <select
              value={filterWinner}
              onChange={(e) => setFilterWinner(e.target.value)}
              className="px-3 py-2 border-2 border-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="all">{t('allWinners') || "All Winners"}</option>
              {winners.map(winner => (
                <option key={winner} value={winner}>
                  {winner}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <p className="text-center">{t('loadingJournal') || "Loading Journal..."}</p>
        ) : journalEntries.length === 0 ? (
          <p className="text-center text-gray-600">{t('journalEmpty') || "Your Combat Journal is empty. Go battle some heroes!"}</p>
        ) : (
          <div className="space-y-6">
            {processedEntries.map((entry) => (
              <div key={entry.id} className="border-2 border-gray-400 rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-around items-center mb-3 text-center border-b pb-2">
                  <div className="flex flex-col items-center">
                    <img
                      src={getOptimizedImageUrl(entry.hero1Image, { width: imageSize })}
                      alt={entry.hero1Name}
                      className="w-16 h-16 object-cover rounded-full border-2 border-blue-500 shadow-md"
                      loading="lazy"
                    />
                    <span className="font-semibold mt-1">{entry.hero1Name}</span>
                  </div>
                  <span className="text-2xl font-bangers text-red-600">VS</span>
                  <div className="flex flex-col items-center">
                    <img
                      src={getOptimizedImageUrl(entry.hero2Image, { width: imageSize })}
                      alt={entry.hero2Name}
                      className="w-16 h-16 object-cover rounded-full border-2 border-red-500 shadow-md"
                      loading="lazy"
                    />
                    <span className="font-semibold mt-1">{entry.hero2Name}</span>
                  </div>
                </div>

                <div className="flex justify-center items-center mb-3">
                  <div className="bg-yellow-100 px-4 py-1 rounded-full border border-yellow-400">
                    <p className="text-center font-bold text-yellow-800">
                      {t('winner') || "Winner"}: <span className="text-red-600">{entry.winnerName}</span>
                    </p>
                  </div>
                </div>

                {entry.battleImage && (
                  <div className="mb-3 text-center">
                    <img
                      src={entry.battleImage}
                      alt="Battle Scene"
                      className="max-w-xs mx-auto rounded-lg border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow"
                      loading="lazy"
                      width={imageSize * 3}
                      height={imageSize * 2}
                    />
                  </div>
                )}

                <div className="text-sm bg-gray-50 p-4 rounded-lg border-2 border-gray-200 max-h-40 overflow-y-auto whitespace-pre-wrap text-left shadow-inner">
                  <h4 className="font-bangers text-lg mb-2 text-gray-700" style={{ letterSpacing: '1px' }}>
                    {t('battleStory') || "Battle Story"}
                  </h4>
                  {entry.battleText.split('\n').map((paragraph, index) => (
                    paragraph.trim() && <p key={index} className="mb-2">{paragraph}</p>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                    {t('battleId') || "Battle ID"}: #{entry.id.split('-')[1]}
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CombatJournal;
