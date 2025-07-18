// /pages/api/transfer-brate.ts
import { NextApiRequest, NextApiResponse } from "next";
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  transfer,
} from "@solana/spl-token";

const BRATE_MINT = new PublicKey("4r8dy53x7MsMfkWkwQL23byJUd19ou1LRHRR68YWzHgS");
const DECIMALS = 1_000_000; // BRATE has 6 decimals

function getPrivateKey(): Uint8Array {
  const secret = process.env.PRIVATE_KEY;
  if (!secret) throw new Error("PRIVATE_KEY is not defined in environment");
  return Uint8Array.from(JSON.parse(secret));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { receiver, amount } = req.body;

  if (!receiver || typeof amount !== "number") {
    return res.status(400).json({ error: "Missing or invalid 'receiver' or 'amount'" });
  }

  try {
    const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

    const fromKeypair = Keypair.fromSecretKey(getPrivateKey());
    const fromWallet = fromKeypair.publicKey;

    // Get source token account
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromKeypair,
      BRATE_MINT,
      fromWallet
    );

    // Get or create destination token account
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromKeypair,
      BRATE_MINT,
      new PublicKey(receiver)
    );

    // Transfer BRATE
    const signature = await transfer(
      connection,
      fromKeypair,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet,
      amount * DECIMALS
    );

    console.log("✅ Transfer success:", signature);
    res.status(200).json({ success: true, signature });
  } catch (err) {
    console.error("❌ Token transfer failed:", err);
    res.status(500).json({ error: "Transfer failed" });
  }
}
