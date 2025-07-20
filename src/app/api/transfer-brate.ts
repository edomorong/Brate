import { NextApiRequest, NextApiResponse } from "next";
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  transfer,
} from "@solana/spl-token";

const BRATE_MINT = new PublicKey("4r8dy53x7MsMfkWkwQL23byJUd19ou1LRHRR68YWzHgS");
const DECIMALS = 1_000_000;

function getPrivateKey(): Uint8Array {
  const secret = process.env.PRIVATE_KEY;
  if (!secret) throw new Error("❌ PRIVATE_KEY no definida en el entorno");

  try {
    return Uint8Array.from(JSON.parse(secret));
  } catch {
    throw new Error("❌ PRIVATE_KEY mal formateada. Debe ser un array JSON");
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
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

    const signature = await transfer(
      connection,
      fromKeypair,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet,
      amount * DECIMALS
    );

    console.log("✅ Transferencia exitosa:", signature);
    res.status(200).json({ success: true, signature });
  } catch (err: any) {
    console.error("❌ Falló la transferencia:", err?.message || err);
    res.status(500).json({ error: "Transfer failed" });
  }
}
