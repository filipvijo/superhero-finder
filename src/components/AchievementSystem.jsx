import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const achievements = [
  {
    id: 'collector_bronze',
    name: 'Rookie Collector',
    description: 'Collect 10 heroes',
    icon: '🥉',
    requirement: 10
  },
  {
    id: 'collector_silver',
    name: 'Hero Enthusiast',
    description: 'Collect 25 heroes',
    icon: '🥈',
    requirement: 25
  },
  {
    id: 'collector_gold',
    name: 'Master Collector',
    description: 'Collect 50 heroes',
    icon: '🥇',
    requirement: 50
  },
  {
    id: 'guesser_bronze',
    name: 'Rookie Detective',
    description: 'Win 5 Guess the Hero games',
    icon: '🔍',
    requirement: 5
  },
  {
    id: 'guesser_silver',
    name: 'Hero Expert',
    description: 'Win 15 Guess the Hero games',
    icon: '🎯',
    requirement: 15
  },
  {
    id: 'guesser_gold',
    name: 'Legendary Detective',
    description: 'Win 30 Guess the Hero games',
    icon: '👑',
    requirement: 30
  },
  {
    id: 'battler_bronze',
    name: 'Arena Rookie',
    description: 'Win 10 Battle Arena matches',
    icon: '⚔️',
    requirement: 10
  },
  {
    id: 'battler_silver',
    name: 'Battle Master',
    description: 'Win 25 Battle Arena matches',
    icon: '🛡️',
    requirement: 25
  },
  {
    id: 'battler_gold',
    name: 'Arena Legend',
    description: 'Win 50 Battle Arena matches',
    icon: '🏆',
    requirement: 50
  }
];

const AchievementSystem = ({ stats, onClose }) => {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showNewAchievement, setShowNewAchievement] = useState(null);

  useEffect(() => {
    // Load unlocked achievements from localStorage
    const saved = localStorage.getItem('unlockedAchievements');
    const savedAchievements = saved ? JSON.parse(saved) : [];
    setUnlockedAchievements(savedAchievements);

    // Check for new achievements
    achievements.forEach(achievement => {
      if (!savedAchievements.includes(achievement.id)) {
        let requirement = false;

        switch (achievement.id) {
          case 'collector_bronze':
          case 'collector_silver':
          case 'collector_gold':
            requirement = stats.collectedHeroes >= achievement.requirement;
            break;
          case 'guesser_bronze':
          case 'guesser_silver':
          case 'guesser_gold':
            requirement = stats.guessGameWins >= achievement.requirement;
            break;
          case 'battler_bronze':
          case 'battler_silver':
          case 'battler_gold':
            requirement = stats.battleWins >= achievement.requirement;
            break;
        }

        if (requirement) {
          const newUnlocked = [...savedAchievements, achievement.id];
          setUnlockedAchievements(newUnlocked);
          localStorage.setItem('unlockedAchievements', JSON.stringify(newUnlocked));
          setShowNewAchievement(achievement);
        }
      }
    });
  }, [stats]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        className="bg-white rounded-lg p-8 max-w-2xl w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-4xl font-bangers text-center mb-8" style={{ letterSpacing: '2px' }}>
          ACHIEVEMENTS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg border-2 ${
                unlockedAchievements.includes(achievement.id)
                  ? 'bg-yellow-100 border-yellow-500'
                  : 'bg-gray-100 border-gray-300'
              }`}
            >
              <div className="text-center mb-2">
                <span className="text-4xl">{achievement.icon}</span>
              </div>
              <h3 className="font-bangers text-lg text-center mb-1" style={{ letterSpacing: '1px' }}>
                {achievement.name}
              </h3>
              <p className="text-sm text-center text-gray-600">
                {achievement.description}
              </p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500"
                  style={{
                    width: `${Math.min(
                      (stats[
                        achievement.id.startsWith('collector')
                          ? 'collectedHeroes'
                          : achievement.id.startsWith('guesser')
                          ? 'guessGameWins'
                          : 'battleWins'
                      ] /
                        achievement.requirement) *
                        100,
                      100
                    )}%`
                  }}
                />
              </div>
              <p className="text-xs text-center mt-1 text-gray-500">
                {stats[
                  achievement.id.startsWith('collector')
                    ? 'collectedHeroes'
                    : achievement.id.startsWith('guesser')
                    ? 'guessGameWins'
                    : 'battleWins'
                ]}{' '}
                / {achievement.requirement}
              </p>
            </motion.div>
          ))}
        </div>

        {showNewAchievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed inset-x-0 bottom-8 flex justify-center"
          >
            <div className="bg-yellow-400 text-black px-6 py-4 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{showNewAchievement.icon}</span>
                <div>
                  <h4 className="font-bangers text-xl" style={{ letterSpacing: '1px' }}>
                    New Achievement Unlocked!
                  </h4>
                  <p className="font-bangers" style={{ letterSpacing: '1px' }}>
                    {showNewAchievement.name}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AchievementSystem;
