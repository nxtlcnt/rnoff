import { motion } from "framer-motion";

const words = ["RnOff : Flood", "Intelligence", "Engine ✨"];

const HeroSection: React.FC = () => {
  return (
    <section
      className="relative w-full h-screen overflow-hidden bg-white bg-cover bg-center bg-no-repeat font-montserrat"
      style={{
        backgroundImage:
          "url('https://cdn.jsdelivr.net/gh/nxtlcnt/cdn-repository/login/images/hero-bg.jpg')",
      }}
    >
      <div className="relative z-10 flex items-center justify-start h-full px-6 md:px-24">
        <motion.div
          className="max-w-4xl text-left text-white space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.3,
              },
            },
          }}
        >
          {words.map((word, index) => (
            <motion.h1
              key={index}
              className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight drop-shadow-md"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {word}
            </motion.h1>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: words.length * 0.3 + 0.2 }}
          >
            <button className="mt-6 px-6 py-3 border border-white text-white bg-blue-400/10 hover:bg-blue-400/20 focus:outline-none focus:ring-2 focus:ring-white transition duration-300 rounded-full">
              Get Started
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
