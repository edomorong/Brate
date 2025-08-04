/*
import type { NextApiRequest, NextApiResponse } from "next";
import {
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  transfer,
} from "@solana/spl-token";

// === VARIABLES SEGURAS DESDE .ENV ===
const BRATE_MINT = new PublicKey(process.env.MINT_ADDRESS!);
const SALE_WALLET = new PublicKey(process.env.SALE_WALLET!);
const DECIMALS = 1_000_000; // 6 decimales (BRATE)
const BRATE_PER_SOL = parseInt(process.env.BRATE_PER_SOL || "1500000", 10);
const MAX_BRATE = parseInt(process.env.MAX_BRATE || "1000000", 10);

// Obtener private key del backend
function getPrivateKey(): Uint8Array {
  const secret = process.env.PRIVATE_KEY;
  if (!secret) throw new Error("❌ PRIVATE_KEY no definida en .env");
  try {
    return Uint8Array.from(JSON.parse(secret));
  } catch {
    throw new Error("❌ PRIVATE_KEY mal formateada. Debe ser un array JSON válido");
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { receiver, amount, solTxSignature } = req.body;

  // --- VALIDACIONES ---
  if (!receiver || typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "Parámetros inválidos" });
  }
  if (!solTxSignature) {
    return res.status(400).json({ error: "Falta firma de transacción SOL" });
  }

  try {
    // Conectar a RPC
    const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_RPC!, "confirmed");

    // Confirmar transacción SOL
    const latestBlock = await connection.getLatestBlockhash();
    const confirmation = await connection.confirmTransaction(
      {
        signature: solTxSignature,
        blockhash: latestBlock.blockhash,
        lastValidBlockHeight: latestBlock.lastValidBlockHeight,
      },
      "confirmed"
    );

    if (confirmation.value?.err) {
      return res.status(400).json({ error: "Transacción SOL fallida o no confirmada" });
    }

    // Calcular BRATE a enviar según cantidad de SOL
    let brateAmount = amount * BRATE_PER_SOL;
    if (brateAmount > MAX_BRATE) brateAmount = MAX_BRATE;

    // Preparar keypair y cuentas
    const fromKeypair = Keypair.fromSecretKey(getPrivateKey());
    const fromWallet = fromKeypair.publicKey;
    const toWallet = new PublicKey(receiver);

    // Verificar saldo del emisor
    const balance = await connection.getBalance(fromWallet);
    if (balance < 0.002 * LAMPORTS_PER_SOL) {
      return res.status(500).json({
        error: "Cuenta emisora sin suficiente SOL para fees",
      });
    }

    // Cuentas asociadas
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromKeypair,
      BRATE_MINT,
      fromWallet
    );

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromKeypair,
      BRATE_MINT,
      toWallet
    );

    // Transferir BRATE
    const signature = await transfer(
      connection,
      fromKeypair,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet,
      brateAmount * DECIMALS
    );

    return res.status(200).json({
      success: true,
      signature,
      solscan: `https://solscan.io/tx/${signature}`,
      message: `${brateAmount.toLocaleString()} BRATE enviados a ${receiver}`,
    });
  } catch (err: any) {
    console.error("❌ Error en transferencia:", err.message || err);
    return res.status(500).json({
      error: "Transferencia fallida",
      details: err.message,
    });
  }
}
*/
