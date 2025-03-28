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
      className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 overflow-y-auto z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-4xl my-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl sm:text-3xl font-bangers text-center mb-6" style={{ letterSpacing: '2px' }}>
          BATTLE ARENA!
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-8 border-red-500 border-t-transparent"></div>
            <p className="mt-4 text-xl sm:text-2xl font-bangers text-red-500" style={{ letterSpacing: '1px' }}>
              BATTLE IN PROGRESS...
            </p>
          </div>
        ) : battleResult ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Hero 1 */}
              <div className="text-center">
                <div className="relative w-32 h-32 sm:w-48 sm:h-48 mx-auto">
                  <img
                    src={hero1.image.url}
                    alt={hero1.name}
                    className="w-full h-full object-cover rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
                <h3 className="mt-2 text-lg sm:text-xl font-bangers" style={{ letterSpacing: '1px' }}>
                  {hero1.name}
                </h3>
              </div>

              {/* Hero 2 */}
              <div className="text-center">
                <div className="relative w-32 h-32 sm:w-48 sm:h-48 mx-auto">
                  <img
                    src={hero2.image.url}
                    alt={hero2.name}
                    className="w-full h-full object-cover rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
                <h3 className="mt-2 text-lg sm:text-xl font-bangers" style={{ letterSpacing: '1px' }}>
                  {hero2.name}
                </h3>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-yellow-50 rounded-lg border-2 border-black">
              <p className="font-bangers text-base sm:text-lg whitespace-pre-line" style={{ letterSpacing: '1px' }}>
                {battleResult}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={resetBattle}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all text-sm sm:text-base"
                style={{ letterSpacing: '1px' }}
              >
                NEW BATTLE
              </button>
              <button
                onClick={onClose}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all text-sm sm:text-base"
                style={{ letterSpacing: '1px' }}
              >
                CLOSE
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Hero 1 Selection */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={searchQuery1}
                    onChange={(e) => setSearchQuery1(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchHeroes(searchQuery1, setSearchResults1)}
                    placeholder="Search hero 1..."
                    className="flex-1 px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => searchHeroes(searchQuery1, setSearchResults1)}
                    className="px-4 py-2 bg-blue-500 text-white font-bangers rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-sm"
                    style={{ letterSpacing: '1px' }}
                  >
                    SEARCH
                  </button>
                </div>

                {searchResults1.length > 0 && (
                  <div className="max-h-48 overflow-y-auto border-2 border-black rounded-lg">
                    {searchResults1.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => {
                          setHero1(result);
                          setSearchResults1([]);
                          setSearchQuery1('');
                        }}
                        className="w-full p-2 text-left hover:bg-gray-100 flex items-center gap-2 border-b-2 border-gray-200 last:border-b-0"
                      >
                        <img
                          src={result.image.url}
                          alt={result.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                        <span>{result.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {hero1 && (
                  <div className="text-center">
                    <div className="relative w-32 h-32 sm:w-48 sm:h-48 mx-auto">
                      <img
                        src={hero1.image.url}
                        alt={hero1.name}
                        className="w-full h-full object-cover rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      />
                      <button
                        onClick={() => setHero1(null)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full border-2 border-black flex items-center justify-center font-bold hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                    <h3 className="mt-2 text-lg sm:text-xl font-bangers" style={{ letterSpacing: '1px' }}>
                      {hero1.name}
                    </h3>
                  </div>
                )}
              </div>

              {/* Hero 2 Selection */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={searchQuery2}
                    onChange={(e) => setSearchQuery2(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchHeroes(searchQuery2, setSearchResults2)}
                    placeholder="Search hero 2..."
                    className="flex-1 px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => searchHeroes(searchQuery2, setSearchResults2)}
                    className="px-4 py-2 bg-blue-500 text-white font-bangers rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-sm"
                    style={{ letterSpacing: '1px' }}
                  >
                    SEARCH
                  </button>
                </div>

                {searchResults2.length > 0 && (
                  <div className="max-h-48 overflow-y-auto border-2 border-black rounded-lg">
                    {searchResults2.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => {
                          setHero2(result);
                          setSearchResults2([]);
                          setSearchQuery2('');
                        }}
                        className="w-full p-2 text-left hover:bg-gray-100 flex items-center gap-2 border-b-2 border-gray-200 last:border-b-0"
                      >
                        <img
                          src={result.image.url}
                          alt={result.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                        <span>{result.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {hero2 && (
                  <div className="text-center">
                    <div className="relative w-32 h-32 sm:w-48 sm:h-48 mx-auto">
                      <img
                        src={hero2.image.url}
                        alt={hero2.name}
                        className="w-full h-full object-cover rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      />
                      <button
                        onClick={() => setHero2(null)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full border-2 border-black flex items-center justify-center font-bold hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                    <h3 className="mt-2 text-lg sm:text-xl font-bangers" style={{ letterSpacing: '1px' }}>
                      {hero2.name}
                    </h3>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-center font-bold">{error}</p>
            )}

            <div className="flex justify-center">
              <button
                onClick={startBattle}
                disabled={!hero1 || !hero2}
                className="px-6 py-3 bg-red-500 text-white font-bangers rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg sm:text-xl"
                style={{ letterSpacing: '1px' }}
              >
                START BATTLE!
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default BattleArena;
