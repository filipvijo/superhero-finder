import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const BattleArena = ({ onClose }) => {
  const [hero1, setHero1] = useState(null);
  const [hero2, setHero2] = useState(null);
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [searchResults1, setSearchResults1] = useState([]);
  const [searchResults2, setSearchResults2] = useState([]);

  const searchHeroes = async (query, setResults) => {
    if (!query.trim()) return;

    try {
      const response = await axios.get(
        `https://superheroapi.com/api.php/${import.meta.env.VITE_SUPERHERO_API_KEY}/search/${query}`
      );

      if (response.data.response === 'success') {
        setResults(response.data.results);
        setError(null);
      } else {
        setResults([]);
        setError(`Could not find hero: ${query}`);
      }
    } catch (err) {
      console.error('Error searching hero:', err);
      setError('Failed to search for hero. Please try again.');
      setResults([]);
    }
  };

  const startBattle = async () => {
    if (!hero1 || !hero2) {
      setError('Please select two heroes first!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const prompt = `Create an exciting battle narrative between ${hero1.name} and ${hero2.name}. Consider their stats:

${hero1.name}:
- Intelligence: ${hero1.powerstats.intelligence}
- Strength: ${hero1.powerstats.strength}
- Speed: ${hero1.powerstats.speed}
- Durability: ${hero1.powerstats.durability}
- Power: ${hero1.powerstats.power}
- Combat: ${hero1.powerstats.combat}

${hero2.name}:
- Intelligence: ${hero2.powerstats.intelligence}
- Strength: ${hero2.powerstats.strength}
- Speed: ${hero2.powerstats.speed}
- Durability: ${hero2.powerstats.durability}
- Power: ${hero2.powerstats.power}
- Combat: ${hero2.powerstats.combat}

Create a dramatic battle story (about 150 words) with a clear winner based on their stats. Make it exciting and comic book style!`;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a comic book battle narrator. Your job is to create exciting, dramatic battle narratives between superheroes. Use present tense and vivid descriptions.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setBattleResult(response.data.choices[0].message.content);
    } catch (err) {
      console.error('Error generating battle:', err);
      setError('Failed to generate battle. Please try again.');
    }

    setLoading(false);
  };

  const resetBattle = () => {
    setHero1(null);
    setHero2(null);
    setBattleResult(null);
    setSearchQuery1('');
    setSearchQuery2('');
    setSearchResults1([]);
    setSearchResults2([]);
    setError(null);
  };

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
        className="bg-white rounded-lg p-6 max-w-4xl w-full border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bangers text-center mb-6" style={{ letterSpacing: '2px' }}>
          BATTLE ARENA!
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-8 border-red-500 border-t-transparent"></div>
            <p className="mt-4 text-2xl font-bangers text-red-500" style={{ letterSpacing: '1px' }}>
              BATTLE IN PROGRESS...
            </p>
          </div>
        ) : battleResult ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Hero 1 */}
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto">
                  <img
                    src={hero1.image.url}
                    alt={hero1.name}
                    className="w-full h-full object-cover rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
                <h3 className="mt-2 text-xl font-bangers" style={{ letterSpacing: '1px' }}>
                  {hero1.name}
                </h3>
              </div>

              {/* Hero 2 */}
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto">
                  <img
                    src={hero2.image.url}
                    alt={hero2.name}
                    className="w-full h-full object-cover rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
                <h3 className="mt-2 text-xl font-bangers" style={{ letterSpacing: '1px' }}>
                  {hero2.name}
                </h3>
              </div>
            </div>

            <div className="p-6 bg-yellow-50 rounded-lg border-2 border-black">
              <p className="font-bangers text-lg whitespace-pre-line" style={{ letterSpacing: '1px' }}>
                {battleResult}
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={resetBattle}
                className="px-6 py-3 bg-blue-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ letterSpacing: '1px' }}
              >
                NEW BATTLE
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-red-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ letterSpacing: '1px' }}
              >
                CLOSE
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Hero 1 Selection */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery1}
                    onChange={(e) => setSearchQuery1(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchHeroes(searchQuery1, setSearchResults1)}
                    placeholder="Search first hero..."
                    className="flex-1 px-4 py-2 rounded-lg text-xl font-bangers bg-white/90 border-4 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    style={{ letterSpacing: '1px' }}
                  />
                  <button
                    onClick={() => searchHeroes(searchQuery1, setSearchResults1)}
                    className="px-6 py-2 bg-blue-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                    style={{ letterSpacing: '1px' }}
                  >
                    SEARCH
                  </button>
                </div>

                {/* Search Results 1 */}
                {searchResults1.length > 0 && (
                  <div className="max-h-48 overflow-y-auto space-y-2 p-2 bg-gray-100 rounded-lg">
                    {searchResults1.map((hero) => (
                      <div
                        key={hero.id}
                        onClick={() => {
                          setHero1(hero);
                          setSearchResults1([]);
                        }}
                        className="flex items-center gap-2 p-2 bg-white rounded cursor-pointer hover:bg-yellow-50"
                      >
                        <img
                          src={hero.image.url}
                          alt={hero.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span className="font-bangers">{hero.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {hero1 && (
                  <div className="text-center">
                    <div className="relative w-48 h-48 mx-auto">
                      <img
                        src={hero1.image.url}
                        alt={hero1.name}
                        className="w-full h-full object-cover rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      />
                    </div>
                    <h3 className="mt-2 text-xl font-bangers" style={{ letterSpacing: '1px' }}>
                      {hero1.name}
                    </h3>
                  </div>
                )}
              </div>

              {/* Hero 2 Selection */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery2}
                    onChange={(e) => setSearchQuery2(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchHeroes(searchQuery2, setSearchResults2)}
                    placeholder="Search second hero..."
                    className="flex-1 px-4 py-2 rounded-lg text-xl font-bangers bg-white/90 border-4 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    style={{ letterSpacing: '1px' }}
                  />
                  <button
                    onClick={() => searchHeroes(searchQuery2, setSearchResults2)}
                    className="px-6 py-2 bg-blue-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                    style={{ letterSpacing: '1px' }}
                  >
                    SEARCH
                  </button>
                </div>

                {/* Search Results 2 */}
                {searchResults2.length > 0 && (
                  <div className="max-h-48 overflow-y-auto space-y-2 p-2 bg-gray-100 rounded-lg">
                    {searchResults2.map((hero) => (
                      <div
                        key={hero.id}
                        onClick={() => {
                          setHero2(hero);
                          setSearchResults2([]);
                        }}
                        className="flex items-center gap-2 p-2 bg-white rounded cursor-pointer hover:bg-yellow-50"
                      >
                        <img
                          src={hero.image.url}
                          alt={hero.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span className="font-bangers">{hero.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {hero2 && (
                  <div className="text-center">
                    <div className="relative w-48 h-48 mx-auto">
                      <img
                        src={hero2.image.url}
                        alt={hero2.name}
                        className="w-full h-full object-cover rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      />
                    </div>
                    <h3 className="mt-2 text-xl font-bangers" style={{ letterSpacing: '1px' }}>
                      {hero2.name}
                    </h3>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <p className="text-center text-red-500 font-bangers" style={{ letterSpacing: '1px' }}>
                {error}
              </p>
            )}

            <div className="flex justify-center gap-4">
              <button
                onClick={startBattle}
                disabled={!hero1 || !hero2}
                className={`px-6 py-3 font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  !hero1 || !hero2
                    ? 'bg-gray-400 text-gray-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
                style={{ letterSpacing: '1px' }}
              >
                START BATTLE!
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-red-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ letterSpacing: '1px' }}
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default BattleArena;
