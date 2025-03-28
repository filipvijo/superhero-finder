import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const MediaHub = ({ hero }) => {
  const [mediaData, setMediaData] = useState({
    movies: [],
    comics: [],
    merchandise: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        // In a real app, we would fetch this data from a backend API
        // For now, we'll use mock data based on the hero
        const mockData = {
          movies: [
            {
              title: `${hero.name}: The Movie`,
              releaseDate: '2025',
              streamingOn: ['Disney+', 'Netflix'],
              purchaseLinks: [
                { platform: 'Amazon', url: 'https://amazon.com' },
                { platform: 'iTunes', url: 'https://itunes.apple.com' }
              ]
            }
          ],
          comics: [
            {
              title: `${hero.name}: Origins`,
              publisher: hero.biography.publisher,
              purchaseLinks: [
                { platform: 'Comixology', url: 'https://comixology.com' },
                { platform: 'Marvel Comics', url: 'https://marvel.com/comics' }
              ]
            }
          ],
          merchandise: [
            {
              type: 'Action Figure',
              store: 'Disney Store',
              url: 'https://shopdisney.com'
            },
            {
              type: 'T-Shirt',
              store: 'Hot Topic',
              url: 'https://hottopic.com'
            }
          ]
        };

        setMediaData(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching media data:', error);
        setLoading(false);
      }
    };

    fetchMediaData();
  }, [hero]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {/* Movies Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-red-500 to-red-700 rounded-lg p-6 text-white shadow-lg"
      >
        <h3 className="text-2xl font-bangers mb-4" style={{ letterSpacing: '1px' }}>
          🎬 Movies & Shows
        </h3>
        {mediaData.movies.map((movie, index) => (
          <div key={index} className="mb-4 bg-white/10 rounded-lg p-4">
            <h4 className="font-bold mb-2">{movie.title}</h4>
            <p className="text-sm mb-2">Release: {movie.releaseDate}</p>
            <div className="mb-2">
              <span className="text-sm font-semibold">Watch on: </span>
              {movie.streamingOn.map((platform, i) => (
                <span key={i} className="inline-block bg-white/20 rounded px-2 py-1 text-xs mr-2">
                  {platform}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {movie.purchaseLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-red-600 rounded px-3 py-1 text-sm font-semibold hover:bg-red-100 transition-colors"
                >
                  Buy on {link.platform}
                </a>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Comics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg p-6 text-white shadow-lg"
      >
        <h3 className="text-2xl font-bangers mb-4" style={{ letterSpacing: '1px' }}>
          📚 Comics
        </h3>
        {mediaData.comics.map((comic, index) => (
          <div key={index} className="mb-4 bg-white/10 rounded-lg p-4">
            <h4 className="font-bold mb-2">{comic.title}</h4>
            <p className="text-sm mb-2">Publisher: {comic.publisher}</p>
            <div className="flex flex-wrap gap-2">
              {comic.purchaseLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-blue-600 rounded px-3 py-1 text-sm font-semibold hover:bg-blue-100 transition-colors"
                >
                  Buy on {link.platform}
                </a>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Merchandise Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-6 text-white shadow-lg"
      >
        <h3 className="text-2xl font-bangers mb-4" style={{ letterSpacing: '1px' }}>
          🛍️ Merchandise
        </h3>
        {mediaData.merchandise.map((item, index) => (
          <div key={index} className="mb-4 bg-white/10 rounded-lg p-4">
            <h4 className="font-bold mb-2">{item.type}</h4>
            <p className="text-sm mb-2">Available at: {item.store}</p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-purple-600 rounded px-3 py-1 text-sm font-semibold hover:bg-purple-100 transition-colors"
            >
              Shop Now
            </a>
          </div>
        ))}
      </motion.div>

      {/* Did You Know Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="md:col-span-2 lg:col-span-3 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg p-6 text-white shadow-lg"
      >
        <h3 className="text-2xl font-bangers mb-4 flex items-center gap-2" style={{ letterSpacing: '1px' }}>
          <span className="text-3xl animate-pulse">💡</span>
          Did You Know?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
          >
            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
              <span className="text-xl">📚</span>
              First Appearance
            </h4>
            <p className="text-sm">
              {hero.biography['first-appearance'] || 'Unknown'}
            </p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
          >
            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
              <span className="text-xl">🎭</span>
              Secret Identity
            </h4>
            <p className="text-sm">
              {hero.biography['full-name'] || hero.name} has {hero.biography['alter-egos'] !== 'No alter egos found.' ? 
                `alternate identities: ${hero.biography['alter-egos']}` : 
                'no known alter egos'}
            </p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
          >
            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
              <span className="text-xl">💪</span>
              Power Stats
            </h4>
            <p className="text-sm">
              Strongest attribute: {Object.entries(hero.powerstats)
                .reduce((max, [stat, value]) => 
                  parseInt(value) > parseInt(max[1]) ? [stat, value] : max, ['', '0'])[0]}
              <br />
              <span className="text-yellow-300">Power Level: {
                Object.values(hero.powerstats).reduce((sum, value) => sum + parseInt(value || 0), 0) / 6
              }%</span>
            </p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
          >
            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
              <span className="text-xl">📏</span>
              Physical Traits
            </h4>
            <p className="text-sm space-y-1">
              <span className="flex justify-between">
                <span>Height:</span> 
                <span className="text-yellow-300">{hero.appearance.height[1]}</span>
              </span>
              <span className="flex justify-between">
                <span>Weight:</span>
                <span className="text-yellow-300">{hero.appearance.weight[1]}</span>
              </span>
              <span className="flex justify-between">
                <span>Eye Color:</span>
                <span className="text-yellow-300">{hero.appearance['eye-color']}</span>
              </span>
              <span className="flex justify-between">
                <span>Hair Color:</span>
                <span className="text-yellow-300">{hero.appearance['hair-color']}</span>
              </span>
            </p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
          >
            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
              <span className="text-xl">💼</span>
              Occupation
            </h4>
            <p className="text-sm space-y-1">
              <span>{hero.work.occupation || 'Unknown occupation'}</span>
              <br />
              <span className="text-yellow-300">Base: {hero.work.base || 'Unknown location'}</span>
            </p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
          >
            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
              <span className="text-xl">🤝</span>
              Connections
            </h4>
            <p className="text-sm space-y-1">
              <span>Group Affiliation:</span>
              <span className="text-yellow-300 block">{hero.connections['group-affiliation'] || 'None known'}</span>
              <span>Relatives:</span>
              <span className="text-yellow-300 block">{hero.connections.relatives || 'None known'}</span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default MediaHub;
