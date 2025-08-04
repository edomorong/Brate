/*
import type { NextApiRequest, NextApiResponse } from "next";
import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// === VARIABLES DE ENTORNO ===
const BRATE_MINT = new PublicKey(process.env.MINT_ADDRESS!);
const SALE_WALLET = new PublicKey(process.env.SALE_WALLET!);
const DECIMALS = 1_000_000; // 6 decimales
const BRATE_PER_SOL = parseInt(process.env.BRATE_PER_SOL || "1500000", 10);
const MAX_BRATE = parseInt(process.env.MAX_BRATE || "1000000", 10);

function getPrivateKey(): Uint8Array {
  const secret = process.env.PRIVATE_KEY;
  if (!secret) throw new Error("PRIVATE_KEY no definida en .env");
  return Uint8Array.from(JSON.parse(secret));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verificar cabecera de seguridad del webhook
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_RPC!, "confirmed");

    // 1. Obtener últimas transacciones hacia la wallet de venta
    const heliusUrl = `https://api.helius.xyz/v0/addresses/${SALE_WALLET.toString()}/transactions?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}&limit=5`;
    const txRes = await fetch(heliusUrl);
    const txData = await txRes.json();

    if (!Array.isArray(txData) || txData.length === 0) {
      return res.json({ ok: true, message: "No hay nuevas transacciones" });
    }

    const fromKeypair = Keypair.fromSecretKey(getPrivateKey());
    const fromWallet = fromKeypair.publicKey;

    // 2. Procesar cada transacción recibida
    for (const tx of txData) {
      const solAmount = tx?.nativeTransfers?.[0]?.amount / LAMPORTS_PER_SOL || 0;
      const sender = tx?.nativeTransfers?.[0]?.fromUserAccount || null;

      if (!sender || solAmount <= 0) continue;

      // Calcular BRATE
      let brateAmount = solAmount * BRATE_PER_SOL;
      if (brateAmount > MAX_BRATE) brateAmount = MAX_BRATE;

      // Crear cuenta asociada del comprador
      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromKeypair,
        BRATE_MINT,
        new PublicKey(sender)
      );

      // Transferir BRATE desde la wallet emisora
      await transfer(
        connection,
        fromKeypair,
        (await getOrCreateAssociatedTokenAccount(connection, fromKeypair, BRATE_MINT, fromWallet)).address,
        toTokenAccount.address,
        fromWallet,
        brateAmount * DECIMALS
      );
    }

    res.json({ ok: true, message: "Transacciones procesadas" });
  } catch (err: any) {
    console.error("Error check-transactions:", err.message);
    res.status(500).json({ error: err.message });
  }
}
*/
