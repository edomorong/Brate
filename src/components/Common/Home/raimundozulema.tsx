"use client";
import React from "react";

export default function RaimundoZulema() {
  return (
    <section
      id="raimundo-zulema"
      className="py-20 px-6 bg-gradient-to-br from-[#0f172a] via-[#0b1a2e] to-[#0f172a] text-white"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4 tracking-wide">ZULEMA & RAIMUNDO</h2>
        <p className="text-gray-300 mb-12 max-w-3xl mx-auto text-lg leading-relaxed">
          Meet the soul of BRATE’s memecoin universe. Zulema brings elegance and future-driven vibes,
          while Raimundo delivers vintage charm and wild creativity. Both are AI-powered holograms… and tradable tokens.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Zulema */}
          <div className="bg-[#0f172a] border border-[#38bdf8] rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300">
            <img
              src="/images/personajes3.png"
              alt="Zulema"
              className="rounded-lg mb-4 w-full object-cover h-64 transition-transform duration-300"
            />
            <h3 className="text-2xl font-semibold mb-2">$ZULEMA</h3>
            <p className="text-gray-300 text-sm mb-2">
              Futuristic. Stylish. Built for smart cities and culture.
            </p>
            <p className="text-gray-400 text-xs mb-2">
              Supply: 1B | Mint & Freeze: Active (Pump.fun default)
            </p>
            <p className="text-gray-400 text-xs mb-4">
              $ZULEMA is part of the BRATE ecosystem. Although launched via Pump.fun and now freely circulating, its future role is planned as an AI assistant within our smart lifestyle experiences. 15% of supply was acquired by the project founder to support long-term growth.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <a
                href="https://pump.fun/BRXQBBnwi3z7wtUwj91hxTtvuAtBKyduoRDe9Widpump"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#38bdf8] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-black font-medium py-2 px-6 rounded-lg transition duration-300"
              >
                Buy $ZULEMA
              </a>
              <a
                href="https://solscan.io/token/BRXQBBnwi3z7wtUwj91hxTtvuAtBKyduoRDe9Widpump"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#38bdf8] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-black font-medium py-2 px-6 rounded-lg transition duration-300"
              >
                View on Solscan
              </a>
            </div>
          </div>

          {/* Raimundo */}
          <div className="bg-[#0f172a] border border-[#38bdf8] rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300">
            <img
              src="/images/personajes4.png"
              alt="Raimundo"
              className="rounded-lg mb-4 w-full object-cover h-64 transition-transform duration-300"
            />
            <h3 className="text-2xl font-semibold mb-2">$RAIMUNDO</h3>
            <p className="text-gray-300 text-sm mb-2">
              Playful. Retro-futuristic. Great for contests and collectibles.
            </p>
            <p className="text-gray-400 text-xs mb-2">
              Supply: 1B | Mint & Freeze: Active (Pump.fun default)
            </p>
            <p className="text-gray-400 text-xs mb-4">
              $RAIMUNDO is the social and gamified counterpart of the BRATE experience. It was fairly launched via Pump.fun and remains fully decentralized. In the future, it may unlock in-app collectibles, challenges, and rewards. The BRATE team holds 15% to support early utility.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <a
                href="https://pump.fun/E1kwJK7CB7EiLgzC96yn8nrc7Fi88DkR7Lg4DmkDpump"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#38bdf8] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-black font-medium py-2 px-6 rounded-lg transition duration-300"
              >
                Buy $RAIMUNDO
              </a>
              <a
                href="https://solscan.io/token/E1kwJK7CB7EiLgzC96yn8nrc7Fi88DkR7Lg4DmkDpump"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#38bdf8] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-black font-medium py-2 px-6 rounded-lg transition duration-300"
              >
                View on Solscan
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
