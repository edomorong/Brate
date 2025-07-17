"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { getImagePrefix } from "@/utils/utils";

const HowItWorks = () => {
  return (
    <section className="py-20 bg-background" id="how-it-works">
      <div className="container mx-auto px-6 lg:px-20 grid md:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-white text-4xl font-bold mb-6">
            How It Works: Real AI in Real Life
          </h2>
          <p className="text-muted text-lg mb-6">
            Discover how BRATE transforms daily experiences through augmented
            reality, blockchain, and smart assistants — all powered by $BRATE.
            From smart glasses to immersive city interactions, we bring AI into
            your world.
          </p>
          <button className="bg-primary hover:bg-primary/80 text-black rounded-lg px-6 py-3">
            Buy Crypto
          </button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
         <Image
  src={`${getImagePrefix()}images/hero/how-it-works-brate.png`}
  alt="How it works illustration"
  width={580}
  height={400}
  className="rounded-xl shadow-lg"
/>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
