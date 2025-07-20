"use client";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

const HowItWorks = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [solAmount, setSolAmount] = useState("0.01");
  const saleWallet = new PublicKey("GY2Tc4KJTN96HtgLga2cEcbuQVvNUotp4TWFvebggE1F");

  const handleBuyClick = useCallback(async () => {
    if (!connected || !publicKey) {
      alert("🔌 Por favor conecta tu wallet Phantom.");
      return;
    }

    try {
      const sol = parseFloat(solAmount);
      const lamports = sol * LAMPORTS_PER_SOL;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: saleWallet,
          lamports,
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      const explorerLink = `https://solscan.io/tx/${signature}`;
      alert(`✅ Transacción enviada!\nVer en Solscan: ${explorerLink}`);
    } catch (error) {
      console.error("Transacción fallida:", error);
      alert("⚠️ La transacción fue cancelada o falló.");
    }
  }, [connected, publicKey, connection, sendTransaction, solAmount]);

  return (
    <section className="py-20 bg-background" id="how-it-works">
      <div className="container mx-auto px-6 lg:px-20 grid md:grid-cols-2 gap-14 items-center">
        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-white text-4xl font-bold mb-6">
            How It Works: Real AI in Real Life
          </h2>
          <p className="text-white text-lg mb-8">
            Discover how BRATE transforms daily experiences through augmented reality,
            blockchain, and smart assistants — all powered by $BRATE. From smart glasses
            to immersive city interactions, we bring AI into your world.
          </p>

          {/* Wallet + Inputs */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="w-full flex justify-center">
              {!connected && (
                <WalletMultiButton className="!min-w-fit !whitespace-nowrap !text-sm !bg-[#7c3aed] hover:!bg-[#8b5cf6] text-white font-semibold px-6 py-2 rounded-lg border border-white" />
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center mt-2">
              {/* Input SOL */}
              <div className="flex items-center justify-between border border-[#38bdf8] rounded-lg px-4 py-2 bg-[#0f172a] w-[200px]">
                <input
                  type="number"
                  min="0.001"
                  step="0.001"
                  value={solAmount}
                  onChange={(e) => setSolAmount(e.target.value)}
                  className="bg-transparent text-white text-sm text-left w-full outline-none"
                />
                <Image
                  src="/images/solana-icon.png"
                  alt="SOL"
                  width={20}
                  height={20}
                  className="ml-2"
                />
              </div>

              {/* BRATE Estimado */}
              <div className="flex items-center justify-between border border-[#38bdf8] rounded-lg px-4 py-2 bg-[#0f172a] w-[200px]">
                <span className="text-[#38bdf8] text-sm">
                  ≈ {(parseFloat(solAmount || "0") / 0.0000005).toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 3,
                  })}
                </span>
                <Image
                  src="/images/brate-icon.png"
                  alt="BRATE"
                  width={20}
                  height={20}
                  className="ml-2"
                />
              </div>
            </div>

            {/* Botón Comprar */}
            <button
              onClick={handleBuyClick}
              className="mt-2 border border-[#38bdf8] text-[#38bdf8] font-medium text-lg px-8 py-2 rounded-lg hover:bg-[#38bdf8] hover:text-darkmode transition"
            >
              Buy BRATE
            </button>
          </div>
        </motion.div>

        {/* Imagen */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <Image
            src="/images/hero/how-it-works-brate.png"
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
