import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Tilt } from "react-tilt";

function HeroDetails({ heroes, favorites }) {
  const { id } = useParams();
  const hero = heroes.find((h) => h.id === id) || favorites.find((f) => f.id === id);

  if (!hero) {
    return (
      <motion.div
        className="text-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">Hero Not Found</h2>
        <motion.button
          className="p-3 rounded font-bold"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/">Back to Search</Link>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="p-6 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.h2
        className="text-3xl font-bold mb-4"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {hero.name}
      </motion.h2>
      <motion.img
        src={hero.image.url}
        alt={hero.name}
        className="w-60 mx-auto rounded mb-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      />
      <Tilt className="tilt-card" options={{ max: 25, scale: 1.05, speed: 300 }}>
        <motion.div
          className="hero-card rounded p-4 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-xl font-bold mb-2">Biography</h3>
          <p><strong>Full Name:</strong> {hero.biography["full-name"] || "Unknown"}</p>
          <p><strong>Aliases:</strong> {hero.biography.aliases.join(", ") || "None"}</p>
          <p><strong>Publisher:</strong> {hero.biography.publisher}</p>
          <p><strong>Alignment:</strong> {hero.biography.alignment}</p>
          <p><strong>First Appearance:</strong> {hero.biography["first-appearance"] || "Unknown"}</p>

          <h3 className="text-xl font-bold mt-4 mb-2">Power Stats</h3>
          <p><strong>Intelligence:</strong> {hero.powerstats.intelligence}</p>
          <p><strong>Strength:</strong> {hero.powerstats.strength}</p>
          <p><strong>Speed:</strong> {hero.powerstats.speed}</p>
          <p><strong>Durability:</strong> {hero.powerstats.durability}</p>
          <p><strong>Power:</strong> {hero.powerstats.power}</p>
          <p><strong>Combat:</strong> {hero.powerstats.combat}</p>

          <h3 className="text-xl font-bold mt-4 mb-2">Appearance</h3>
          <p><strong>Gender:</strong> {hero.appearance.gender}</p>
          <p><strong>Race:</strong> {hero.appearance.race || "Unknown"}</p>
          <p><strong>Height:</strong> {hero.appearance.height.join(" / ")}</p>
          <p><strong>Weight:</strong> {hero.appearance.weight.join(" / ")}</p>
          <p><strong>Eye Color:</strong> {hero.appearance["eye-color"]}</p>
          <p><strong>Hair Color:</strong> {hero.appearance["hair-color"]}</p>

          <h3 className="text-xl font-bold mt-4 mb-2">Work</h3>
          <p><strong>Occupation:</strong> {hero.work.occupation || "Unknown"}</p>
          <p><strong>Base:</strong> {hero.work.base || "Unknown"}</p>
        </motion.div>
      </Tilt>
      <motion.button
        className="mt-4 inline-block p-3 rounded font-bold"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to="/">Back to Search</Link>
      </motion.button>
    </motion.div>
  );
}

export default HeroDetails;