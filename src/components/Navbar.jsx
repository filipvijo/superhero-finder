import { motion } from 'framer-motion';

const Navbar = ({ favorites, unlockedHeroes, setShowFavorites, setShowCollection, setShowingHome }) => {
  return (
    <nav className="bg-gray-900 text-white py-4 px-6 shadow-lg">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
        <motion.h1
          whileHover={{ scale: 1.05 }}
          onClick={() => {
            setShowFavorites(false);
            setShowCollection(false);
            setShowingHome(true);
          }}
          className="text-3xl font-bangers cursor-pointer text-yellow-400 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
          style={{ letterSpacing: '2px' }}
        >
          SUPERHERO FINDER
        </motion.h1>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowFavorites(true);
              setShowCollection(false);
              setShowingHome(false);
            }}
            className="px-4 py-2 bg-yellow-400 text-black font-bangers rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
            style={{ letterSpacing: '1px' }}
          >
            <span>FAVORITES</span>
            <span className="bg-black text-yellow-400 px-2 py-1 rounded-full text-sm">
              {favorites.length}
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowFavorites(false);
              setShowCollection(true);
              setShowingHome(false);
            }}
            className="px-4 py-2 bg-purple-500 text-white font-bangers rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
            style={{ letterSpacing: '1px' }}
          >
            <span>COLLECTION</span>
            <span className="bg-white text-purple-500 px-2 py-1 rounded-full text-sm">
              {unlockedHeroes.length}
            </span>
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
