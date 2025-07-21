"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const TOKEN_ADDRESS = "4r8dy53x7MsMfkWkwQL23byJUd19ou1LRHRR68YWzHgS";
const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY;

export default function Hero() {
  const [holders, setHolders] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [solAmount, setSolAmount] = useState("0.01");

  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const saleWallet = new PublicKey("7vPwgHYpdwXiqoRy25uAUat1WdH8CXdueVUTDbDkgiGF");

  useEffect(() => {
    async function fetchHolders() {
      try {
        const res = await fetch(
          `https://api.helius.xyz/v0/token-metadata?api-key=${HELIUS_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mintAccounts: [TOKEN_ADDRESS] }),
          }
        );
        const data = await res.json();
        const count = data?.[0]?.tokenInfo?.holders || null;
        setHolders(count);
      } catch (e) {
        console.error("Error fetching holders:", e);
        setHolders(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHolders();
  }, []);

  const handleBuyClick = useCallback(async () => {
    if (!connected || !publicKey) {
      alert("🔌 Conecta tu wallet Phantom para continuar.");
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

      const brateAmount = sol / 0.0000005;

      const res = await fetch("/api/transfer-brate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiver: publicKey.toString(),
          amount: brateAmount,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Transferencia de BRATE fallida");
      }

      alert(`✅ Transacción enviada!\nhttps://solscan.io/tx/${signature}`);
    } catch (err) {
      console.error("Transaction error:", err);
      alert("⚠️ Transacción cancelada o fallida.");
    }
  }, [connected, publicKey, connection, sendTransaction, solAmount]);

  return (
    <section className="relative md:pt-40 md:pb-28 py-20 overflow-hidden z-1" id="main-banner">
      <div className="container mx-auto lg:max-w-screen-xl px-4">
        <div className="grid grid-cols-12 items-center">
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 col-span-12"
          >
            <div className="flex items-center gap-6 justify-center lg:justify-start mb-5 mt-24">
              <Image src="/images/icons/icon-bag.svg" alt="icon" width={40} height={40} />
              <p className="text-white sm:text-28 text-18 mb-0">
                Crypto On The <span className="text-[#38bdf8]">Go</span>
              </p>
            </div>

            <h1 className="text-white font-medium lg:text-76 md:text-70 text-54 text-center lg:text-start mb-3">
              Join the future of <span className="text-[#38bdf8]">Crypto</span> with <span className="text-[#38bdf8]">BRATE</span>!
            </h1>

            <p className="text-white text-center lg:text-start mb-6 text-[15px]">
              A revolutionary AI-powered crypto-social app that lets you navigate the real and digital world, earn rewards, make payments, and explore new opportunities.
            </p>

            <p className="text-white text-center lg:text-start mb-6 text-[15px] leading-snug">
              The first 100 holders of <span className="text-[#38bdf8] font-bold">$BRATE</span> will unlock early rewards.
              <br />
              <span className="font-medium text-[#38bdf8]">Secure your place now!</span>
            </p>

            {/* Wallet + Inputs */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6 w-full">
              <div className="w-full md:w-auto">
                <WalletMultiButton className="!min-w-full !whitespace-nowrap !text-sm !px-6 !py-2 !bg-[#7c3aed] hover:!bg-[#8b5cf6] text-white font-semibold rounded-lg border border-white w-full" />
              </div>

              <div className="flex items-center border border-[#38bdf8] rounded-lg px-3 py-2 bg-[#0f172a] w-full md:w-[200px]">
                <input
                  type="number"
                  min="0.001"
                  step="0.001"
                  value={solAmount}
                  onChange={(e) => setSolAmount(e.target.value)}
                  className="bg-transparent text-white text-sm w-full outline-none text-left placeholder:text-gray-400"
                  placeholder="0.00"
                />
                <Image src="/images/solana-icon.png" alt="SOL" width={18} height={18} className="ml-2 object-contain" />
              </div>

              <div className="flex items-center border border-[#38bdf8] rounded-lg px-3 py-2 bg-[#0f172a] w-full md:w-[200px] justify-between">
                <span className="text-[#38bdf8] font-medium text-sm truncate">
                  ≈ {(parseFloat(solAmount || "0") / 0.0000005).toLocaleString()}
                </span>
                <Image src="/images/brate-icon.png" alt="BRATE" width={18} height={18} className="object-contain" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center lg:justify-start mt-6">
              <button
                onClick={handleBuyClick}
                className="w-full md:w-auto border border-[#38bdf8] text-[#38bdf8] font-medium text-21 px-7 py-2 rounded-lg hover:bg-[#38bdf8] hover:text-darkmode transition"
              >
                Buy BRATE
              </button>
              <a
                href={`https://solscan.io/token/${TOKEN_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto border border-[#38bdf8] text-[#38bdf8] font-medium text-21 px-7 py-2 rounded-lg hover:bg-[#38bdf8] hover:text-darkmode transition text-center"
              >
                View Info
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10 text-white text-center">
              <div className="bg-[#0f172a] border border-[#38bdf8] p-4 rounded-lg">
                <p className="text-sm">Total Supply</p>
                <p className="text-[#38bdf8] font-bold">1,000,000,000</p>
              </div>
              <div className="bg-[#0f172a] border border-[#38bdf8] p-4 rounded-lg">
                <p className="text-sm">Available for Sale</p>
                <p className="text-[#38bdf8] font-bold">150,000,000</p>
              </div>
              <div className="bg-[#0f172a] border border-[#38bdf8] p-4 rounded-lg">
                <p className="text-sm">Holders</p>
                <p className="text-[#38bdf8] font-bold">{isLoading ? "..." : holders ?? "?"}</p>
              </div>
              <div className="bg-[#0f172a] border border-[#38bdf8] p-4 rounded-lg">
                <p className="text-sm">Circulating Supply</p>
                <p className="text-[#38bdf8] font-bold">0</p>
              </div>
              <div className="bg-[#0f172a] border border-[#38bdf8] p-4 rounded-lg">
                <p className="text-sm">Wallet Activa</p>
                <p className="text-[#38bdf8] font-bold">15% Liquidez</p>
              </div>
              <div className="bg-[#0f172a] border border-[#38bdf8] p-4 rounded-lg">
                <p className="text-sm">Distribución</p>
                <p className="text-[#38bdf8] font-bold">Fase 1: Venta Inicial</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="col-span-12 lg:col-span-7 mt-10 lg:mt-0 flex justify-center lg:justify-end"
          >
            <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[600px] px-4">
              <Image
                src="/images/hero/banner-image.png"
                alt="Banner"
                width={1150}
                height={1150}
                className="object-contain w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
