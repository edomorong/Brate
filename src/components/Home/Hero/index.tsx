"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";
import getProvider from "@/utils/getProvider";

export default function Hero() {
  const [tokenData, setTokenData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saleWallet = "7vPwgHYpdwXiqoRy25uAUat1WdH8CXdueVUTDbDkgiGF";

  useEffect(() => {
    async function fetchTokenData() {
      try {
        const res = await fetch(
          `https://solana-gateway.moralis.io/token/mainnet/4r8dy53x7MsMfkWkwQL23byJUd19ou1LRHRR68YWzHgS/metadata`,
          {
            headers: {
              accept: "application/json",
              "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API_KEY || "",
            },
          }
        );
        const json = await res.json();
        setTokenData(json);
      } catch (error) {
        console.error("Error fetching token data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTokenData();
  }, []);

  const handleBuyClick = async () => {
    try {
      const provider = await getProvider();
      if (!provider) {
        alert("Phantom Wallet no encontrada.");
        return;
      }

      const res = await provider.connect();
      const userPublicKey = res.publicKey;

      const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
      const lamports = 10000000; // 0.01 SOL

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(userPublicKey),
          toPubkey: new PublicKey(saleWallet),
          lamports,
        })
      );

      transaction.feePayer = userPublicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const signed = await provider.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(signature);

      const sol = lamports / 1e9;
      const estimatedBRATE = sol / 0.0000005;
      const explorerLink = `https://solscan.io/tx/${signature}`;

      await fetch("/api/notify-discord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sol,
          brate: estimatedBRATE,
          wallet: userPublicKey.toString(),
          tx: explorerLink,
        }),
      });

      await fetch("/api/transfer-brate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiver: userPublicKey.toString(),
          amount: estimatedBRATE,
        }),
      });

      alert(`✅ Compra completada! TX: ${explorerLink}`);
    } catch (err) {
      console.error("Error al conectar:", err);
      alert("⚠️ Error al procesar la compra.");
    }
  };

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
              Join the future of <span className="text-[#38bdf8]">Crypto</span> with {" "}
              <span className="text-[#38bdf8]">BRATE</span>!
            </h1>

            <p className="text-white text-center lg:text-start mb-6 text-[15px]">
              A revolutionary AI-powered crypto-social app that lets you navigate the real and
              digital world, earn rewards, make payments, and explore new opportunities.
            </p>

            <p className="text-white text-center lg:text-start mb-6 text-[15px] leading-snug">
              The first 100 holders of {" "}
              <span className="text-[#38bdf8] font-bold">$BRATE</span> will unlock exclusive early
              staking rewards. As demand grows, price increases automatically. This ensures fair
              access and long-term commitment. <br />
              <span className="font-medium text-[#38bdf8]">Secure your place now!</span>
            </p>

            <div className="flex gap-8 justify-center lg:justify-start">
              <button
                onClick={handleBuyClick}
                className="border border-[#38bdf8] text-[#38bdf8] font-medium text-21 px-7 py-2 rounded-lg hover:bg-[#38bdf8] hover:text-darkmode transition"
              >
                Buy BRATE
              </button>

              <a
                href="https://solscan.io/token/4r8dy53x7MsMfkWkwQL23byJUd19ou1LRHRR68YWzHgS"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#38bdf8] text-[#38bdf8] font-medium text-21 px-7 py-2 rounded-lg hover:bg-[#38bdf8] hover:text-darkmode transition"
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
                <p className="text-[#38bdf8] font-bold">
                  {isLoading ? "Loading..." : tokenData?.holders || "8"}
                </p>
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
            className="col-span-7 hidden lg:block"
          >
            <div className="ml-20 -mr-64 max-w-[600px]">
              <Image
                src="/images/hero/banner-image.png"
                alt="Banner"
                width={1150}
                height={1150}
                className="object-contain"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute w-50 h-50 bg-gradient-to-bl from-tealGreen to-charcoalGray blur-400 rounded-full -top-64 -right-14 -z-1"></div>
    </section>
  );
}