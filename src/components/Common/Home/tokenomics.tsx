"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const tokenData = [
  { label: "Airdrop Phase 1", percent: "15%", color: "bg-[#1e88e5]", detail: "Q1 2026 – Organic growth & staking" },
  { label: "Airdrop Phase 2", percent: "10%", color: "bg-[#1976d2]", detail: "Q2 2026 – Testers & real alliances" },
  { label: "Staking & Rewards", percent: "20%", color: "bg-[#0288d1]", detail: "Q4 2025 to Q4 2026" },
  { label: "Initial Liquidity", percent: "15%", color: "bg-[#26c6da]", detail: "Q1 2026 – MVP activation" },
  { label: "Project Development", percent: "15%", color: "bg-[#fb8c00]", detail: "Q3 2025 to Q2 2027" },
  { label: "Strategic Reserves", percent: "10%", color: "bg-[#ef6c00]", detail: "Multisig custody – partial unlocks" },
  { label: "Founding Team", percent: "15%", color: "bg-[#e53935]", detail: "Locked until Q2 2027 – linear release" },
];

export default function TokenomicsSection() {
  return (
    <section className="py-16 md:py-20 bg-dark text-white text-center" id="tokenomics">
      <h2 className="text-4xl font-bold text-white mb-4">Tokenomics</h2>
      <p className="text-white/70 mb-10 max-w-2xl mx-auto">
        Token distribution is designed to support the growth, sustainability, and fairness of the project. Each allocation serves a clear strategic purpose.
      </p>

      {/* 🎯 Animated chart */}
      <motion.div
        className="flex flex-col items-center mb-12"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 150 }}
        >
          <Image
            src="/images/tokenomics/grafico.png"
            alt="Token Distribution"
            width={400}
            height={400}
            className="object-contain"
          />
        </motion.div>
      </motion.div>

      {/* 🔹 Top row: 4 cards */}
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {tokenData.slice(0, 4).map((item, i) => (
          <motion.div
            key={i}
            className={`rounded-xl px-4 py-3 w-64 text-white shadow-lg ${item.color} flex flex-col justify-between transition-all`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="flex justify-between items-center w-full mb-1">
              <p className="text-sm font-semibold">{item.label}</p>
              <span className="text-sm font-bold">{item.percent}</span>
            </div>
            <p className="text-xs text-white/90">{item.detail}</p>
          </motion.div>
        ))}
      </div>

      {/* 🔸 Bottom row: 3 cards */}
      <div className="flex flex-wrap justify-center gap-4">
        {tokenData.slice(4).map((item, i) => (
          <motion.div
            key={i}
            className={`rounded-xl px-4 py-3 w-64 text-white shadow-lg ${item.color} flex flex-col justify-between transition-all`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="flex justify-between items-center w-full mb-1">
              <p className="text-sm font-semibold">{item.label}</p>
              <span className="text-sm font-bold">{item.percent}</span>
            </div>
            <p className="text-xs text-white/90">{item.detail}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
