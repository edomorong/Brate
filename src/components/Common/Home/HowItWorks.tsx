"use client";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

// Cargar WalletMultiButton sin SSR para evitar errores de hidratación
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

const HowItWorks = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [solAmount, setSolAmount] = useState("0.01");

  const saleWallet = new PublicKey(SALE_WALLET);

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

      // 1. Transferir SOL al wallet de venta
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

      // 2. Llamar API para enviar BRATE (igual que en Hero)
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
    } catch (err) {
      console.error("Transaction error:", err);
      alert("⚠️ Transacción cancelada o fallida.");
    }
  }, [connected, publicKey, connection, sendTransaction, solAmount]);

  return (
    <section className="py-20 bg-background" id="how-it-works">
      <div className="container mx-auto px-6 lg:px-20 grid md:grid-cols-2 gap-14 items-center">
        {/* Texto */}
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

          {/* Sección Inputs + Botones en 2 filas */}
          <div className="flex flex-col items-center gap-4 mb-6">
            {/* Fila superior: Inputs */}
            <div className="flex flex-row gap-4">
              {/* Input SOL */}
              <div className="flex items-center border border-[#38bdf8] rounded-lg px-3 py-2 bg-[#0f172a] w-[160px]">
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

              {/* BRATE estimado */}
              <div className="flex items-center border border-[#38bdf8] rounded-lg px-3 py-2 bg-[#0f172a] w-[160px] justify-between">
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

            {/* Fila inferior: Botones */}
            <div className="flex flex-row gap-4">
              <WalletMultiButton className="!min-w-[160px] !text-sm !px-6 !py-2 !bg-[#7c3aed] hover:!bg-[#8b5cf6] text-white font-semibold rounded-lg border border-white" />
              <button
                onClick={handleBuyClick}
                className="w-[160px] border border-[#38bdf8] text-[#38bdf8] font-medium text-lg px-6 py-2 rounded-lg hover:bg-[#38bdf8] hover:text-darkmode transition"
              >
                Buy BRATE
              </button>
            </div>
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
