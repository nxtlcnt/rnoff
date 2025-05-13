import { Satellite, BrainCircuit, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Satellite className="w-12 h-12 text-blue-400" />,
    title: "Remote Sensing Based",
    description: "Revealing geothermal potential without invasive drilling.",
  },
  {
    icon: <BrainCircuit className="w-12 h-12 text-blue-400" />,
    title: "Geospatial AI Engine",
    description:
      "Predicting high-potential geothermal zones through data-driven analysis.",
  },
  {
    icon: <Zap className="w-12 h-12 text-blue-400" />,
    title: "Climate-Conscious Vision",
    description:
      "Advancing clean energy access through sustainable geothermal innovation.",
  },
];

const PurposeSection = () => {
  return (
    <section className="bg-white py-20 px-6 md:px-12 text-black">
      <div className="max-w-6xl mx-auto text-center space-y-12">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-blue-400">
            Pioneering the Future of Geothermal Intelligence
          </h2>
          <p className="text-md max-w-4xl mx-auto text-gray-700">
            We integrate satellite technology, artificial intelligence, and
            sustainability principles to revolutionize how geothermal resources
            are discovered and utilized—minimizing risk and maximizing
            environmental value.
          </p>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-3 items-center text-center max-w-4xl mx-auto justify-items-center">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center space-y-6 max-w-xs"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              {feature.icon}
              <h3 className="text-md font-semibold text-blue-400">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PurposeSection;
