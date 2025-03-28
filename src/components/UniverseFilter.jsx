import { motion } from 'framer-motion';

const universes = [
  {
    id: 'marvel',
    name: 'Marvel',
    color: 'bg-red-500',
    logo: 'https://cdn.jsdelivr.net/gh/filipvijo/superhero-finder@main/public/marvel-logo.png'
  },
  {
    id: 'dc',
    name: 'DC',
    color: 'bg-blue-500',
    logo: 'https://cdn.jsdelivr.net/gh/filipvijo/superhero-finder@main/public/dc-logo.png'
  },
  {
    id: 'other',
    name: 'Other',
    color: 'bg-purple-500',
    logo: 'https://cdn.jsdelivr.net/gh/filipvijo/superhero-finder@main/public/other-heroes.png'
  }
];

const UniverseFilter = ({ selectedUniverse, onSelectUniverse }) => {
  return (
    <div className="flex justify-center gap-4 mb-8">
      {universes.map((universe) => (
        <motion.button
          key={universe.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectUniverse(universe.id === selectedUniverse ? null : universe.id)}
          className={`relative px-6 py-3 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all ${
            universe.color
          } ${selectedUniverse === universe.id ? 'ring-4 ring-yellow-400' : ''}`}
        >
          <img
            src={universe.logo}
            alt={`${universe.name} Logo`}
            className="h-8 w-auto filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
          />
          <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-0.5 text-sm font-bangers rounded-full border-2 border-black">
            {universe.name}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default UniverseFilter;
