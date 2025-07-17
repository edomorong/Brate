"use client";

import Image from "next/image";
import { getImagePrefix } from "@/utils/utils";
import { motion } from "framer-motion";

const Developer = () => {
  return (
    <section
      id="developers"
      className="py-24 bg-gradient-to-b from-[#0B0E1A] to-[#0A0E17]"
    >
      <div className="container mx-auto lg:max-w-screen-xl px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white text-4xl sm:text-5xl font-bold mb-6"
        >
          Developer Ecosystem
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-muted-foreground text-lg sm:text-xl max-w-3xl mx-auto mb-12"
        >
          BRATE AI empowers developers to build immersive tools, AR apps, and tokenized experiences on a modular platform.
        </motion.p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src={`${getImagePrefix()}images/hero/developer-ecosystem.png`}
            alt="Developer Ecosystem"
            width={1200}
            height={800}
            className="mx-auto rounded-2xl shadow-xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Developer;

