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
import dynamic from "next/dynamic";

// Evitar error de hidratación con WalletMultiButton
const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

// Variables de entorno
const TOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_MINT_ADDRESS ||
  "4r8dy53x7MsMfkWkwQL23byJUd19ou1LRHRR68YWzHgS";
const SALE_WALLET =
  process.env.NEXT_PUBLIC_SALE_WALLET ||
  "7vPwgHYpdwXiqoRy25uAUat1WdH8CXdueVUTDbDkgiGF";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [holders, setHolders] = useState<number | null>(null);
  const [circulating, setCirculating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [solAmount, setSolAmount] = useState("0.01");

  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const saleWallet = new PublicKey(SALE_WALLET);

  useEffect(() => setMounted(true), []);

  /**
   * Obtiene datos reales desde Solscan API
   * - Holders: número actual de holders
   * - Circulating Supply: supply actual en circulación
   */
  const fetchData = async () => {
    try {
      // --- Holders desde Solscan ---
      const holdersRes = await fetch(
        `https://api.solscan.io/token/holders?tokenAddress=${TOKEN_ADDRESS}&limit=1`
      );
      const holdersData = await holdersRes.json();
      const holderCount = holdersData?.data?.total || 0;
      setHolders(holderCount);

      // --- Circulating Supply desde Solscan ---
      const supplyRes = await fetch(
        `https://api.solscan.io/token/meta?tokenAddress=${TOKEN_ADDRESS}`
      );
      const supplyData = await supplyRes.json();
      const circSupply =
        Number(supplyData?.data?.supply || 0) /
        Math.pow(10, supplyData?.data?.decimals || 9);
      setCirculating(circSupply);
    } catch (e) {
      console.error("Error obteniendo métricas desde Solscan:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // cada 30s
    return () => clearInterval(interval);
  }, []);

  // --- Botón de compra (sin cambios) ---
  const handleBuyClick = useCallback(async () => {
    if (!connected || !publicKey) {
      alert("🔌 Conecta tu wallet Phantom para continuar.");
      return;
    }

    try {
      const sol = parseFloat(solAmount.replace(",", "."));
      if (isNaN(sol) || sol <= 0) {
        alert("Monto inválido");
        return;
      }

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

      const res = await fetch("/api/buy-brate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer: publicKey.toString(),
          solAmount: sol,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Error backend buy-brate:", error);
        throw new Error(error.error || "Error al enviar BRATE");
      }

      const data = await res.json();
      alert(`✅ Compra exitosa!\n${data.message}\n${data.solscan}`);

      fetchData(); // refrescar métricas tras compra
    } catch (err) {
      console.error("Transaction error:", err);
      alert("⚠️ Transacción cancelada o fallida.");
    }
  }, [connected, publicKey, connection, sendTransaction, solAmount]);

  if (!mounted) return <div />;

  return (
    <section
      className="relative md:pt-40 md:pb-28 py-20 overflow-hidden z-1"
      id="main-banner"
    >
      <div className="container mx-auto lg:max-w-screen-xl px-4">
        <div className="grid grid-cols-12 items-center">
          {/* Columna izquierda */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 col-span-12"
          >
            <div className="flex items-center gap-4 mb-4">
              <Image
                src="/images/icons/icon-bag.svg"
                alt="Crypto On The Go"
                width={30}
                height={30}
              />
              <p className="text-white sm:text-28 text-18 mb-0">
                Crypto On The <span className="text-[#38bdf8]">Go</span>
              </p>
            </div>

            <h1 className="text-white font-medium lg:text-76 md:text-70 text-54 text-center lg:text-start mb-6">
              Join the future of <span className="text-[#38bdf8]">Crypto</span>{" "}
              with <span className="text-[#38bdf8]">$BRATE</span>!
            </h1>

            <p className="text-white text-center lg:text-start mb-6 text-[15px] leading-snug">
              A revolutionary AI-powered crypto-social app that lets you navigate
              the real and digital world, earn rewards, make payments, and explore
              new opportunities.
            </p>

            <p className="text-white text-center lg:text-start mb-6 text-[15px] leading-snug">
              The first 100 holders of{" "}
              <span className="text-[#38bdf8] font-bold">$BRATE</span> will unlock
              early rewards. <br />
              <span className="font-medium text-[#38bdf8]">
                Secure your place now!
              </span>
            </p>

            {/* Wallet + Inputs */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6 w-full">
              <WalletMultiButton className="!min-w-full md:!w-auto !whitespace-nowrap !text-sm !px-6 !py-2 !bg-[#7c3aed] hover:!bg-[#8b5cf6] text-white font-semibold rounded-lg border border-white" />

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
                <Image
                  src="/images/solana-icon.png"
                  alt="SOL"
                  width={18}
                  height={18}
                  className="ml-2 object-contain"
                />
              </div>

              <div className="flex items-center border border-[#38bdf8] rounded-lg px-3 py-2 bg-[#0f172a] w-full md:w-[200px] justify-between">
                <span className="text-[#38bdf8] font-medium text-sm truncate">
                  ≈ {(parseFloat(solAmount || "0") * 1_500_000).toLocaleString()}
                </span>
                <Image
                  src="/images/brate-icon.png"
                  alt="BRATE"
                  width={18}
                  height={18}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Botones */}
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

            {/* Stats */}
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
                  {isLoading ? "..." : holders ?? "?"}
                </p>
              </div>
              <div className="bg-[#0f172a] border border-[#38bdf8] p-4 rounded-lg">
                <p className="text-sm">Circulating Supply</p>
                <p className="text-[#38bdf8] font-bold">
                  {circulating.toLocaleString()}
                </p>
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

          {/* Columna derecha */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 col-span-12 flex justify-center mt-10 lg:mt-0"
          >
            <Image
              src="/images/hero/banner-image2.png"
              alt="BRATE Banner"
              width={600}
              height={600}
              className="object-contain"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
