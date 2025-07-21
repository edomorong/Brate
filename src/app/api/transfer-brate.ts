// src/pages/api/transfer-brate.ts
import { NextApiRequest, NextApiResponse } from "next";
import {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  transfer,
} from "@solana/spl-token";

// Dirección del token BRATE
const BRATE_MINT = new PublicKey("4r8dy53x7MsMfkWkwQL23byJUd19ou1LRHRR68YWzHgS");
const DECIMALS = 1_000_000; // Para 6 decimales

// 🟡 Usa esta cuenta pública para verificar desde fuera:
// https://solscan.io/account/7vPwgHYpdwXiqoRy25uAUat1WdH8CXdueVUTDbDkgiGF

// 🔐 Leer PRIVATE_KEY del entorno
function getPrivateKey(): Uint8Array {
  const secret = process.env.PRIVATE_KEY;
  if (!secret) throw new Error("❌ PRIVATE_KEY no definida en el entorno");

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

  const { receiver, amount } = req.body;

  if (!receiver || typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "Parámetros inválidos: 'receiver' o 'amount'" });
  }

  try {
    const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
    const fromKeypair = Keypair.fromSecretKey(getPrivateKey());
    const fromWallet = fromKeypair.publicKey;
    const toWallet = new PublicKey(receiver);

    // 1. Confirmar si tiene suficiente balance en SOL
    const balance = await connection.getBalance(fromWallet);
    if (balance < 0.002 * LAMPORTS_PER_SOL) {
      return res.status(500).json({
        error: "La cuenta de BRATE no tiene suficiente SOL para cubrir el gas",
      });
    }

    // 2. Obtener o crear cuentas SPL asociadas
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

    // 3. Transferencia de tokens
    const signature = await transfer(
      connection,
      fromKeypair,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet,
      amount * DECIMALS
    );

    console.log("✅ BRATE enviado:", signature);
    res.status(200).json({ success: true, signature });
  } catch (err: any) {
    console.error("❌ Fallo la transferencia:", err?.message || err);
    res.status(500).json({ error: "Transferencia fallida" });
  }
}
