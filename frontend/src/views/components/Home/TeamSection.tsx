import React from "react";
import { motion } from "framer-motion";

const TeamSection: React.FC = () => {
  const teamMembers = [
    {
      name: "Satya Wicaksana",
      nim: "As Hacker",
      photo: "/images/member/jahro.png",
    },
    {
      name: "Fatimah Aufadin",
      nim: "As Hipster",
      photo: "/images/member/fadin.png",
    },
    {
      name: "Zahra Salsabila",
      nim: "As Hustler",
      photo: "/images/member/obed.png",
    },
  ];

  return (
    <section className="py-16 text-center bg-black">
      <motion.h2
        className="text-xl md:text-2xl font-bold text-white mb-12"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Our Team
      </motion.h2>

      <div className="flex flex-wrap justify-center gap-16 max-w-6xl mx-auto">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            className="w-36 md:w-44 flex flex-col items-center space-y-8 px-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: Math.min(index * 0.2, 1) }}
            viewport={{ once: true }}
          >
            <img
              src={member.photo}
              alt={member.name}
              loading="lazy"
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover shadow-lg"
            />
            <div className="flex flex-col space-y-2 text-center">
              <p className="text-base sm:text-md font-semibold text-white">
                {member.name}
              </p>
              <p className="text-sm text-gray-400">{member.nim}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
