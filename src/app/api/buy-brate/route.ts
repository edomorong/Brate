import { NextResponse } from "next/server";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
  transfer,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

// ---------------- CONFIG ----------------
const mintAddress = process.env.NEXT_PUBLIC_MINT_ADDRESS;
if (!mintAddress) {
  throw new Error("NEXT_PUBLIC_MINT_ADDRESS no está configurado en variables de entorno");
}
const BRATE_MINT = new PublicKey(mintAddress);
const DECIMALS = parseInt(process.env.TOKEN_DECIMALS || "9", 10);
const BRATE_PER_SOL = parseInt(process.env.BRATE_PER_SOL || "15000", 10);
const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY || "";

// ---------------- HELPERS ----------------
function parsePrivateKey(): Uint8Array {
  const keyEnv = process.env.PRIVATE_KEY || "";
  if (!keyEnv) throw new Error("PRIVATE_KEY no configurada");

  return Uint8Array.from(JSON.parse(keyEnv));
}

// ---------------- POST ----------------
export async function POST(req: Request) {
  try {
    const { buyer, solAmount } = await req.json();

    if (!buyer || typeof solAmount !== "number" || solAmount <= 0) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_RPC!, "confirmed");

    // Calcular BRATE
    const brateAmount = solAmount * BRATE_PER_SOL;
    const brateInSmallestUnit = Math.floor(brateAmount * 10 ** DECIMALS);

    const fromKeypair = Keypair.fromSecretKey(parsePrivateKey());
    const fromWallet = fromKeypair.publicKey;
    const buyerPubkey = new PublicKey(buyer);

    // Crear/verificar ATA de vendedor
    const fromATA = await getAssociatedTokenAddress(
      BRATE_MINT,
      fromWallet,
      false,
      TOKEN_2022_PROGRAM_ID
    );
    try {
      await getAccount(connection, fromATA, undefined, TOKEN_2022_PROGRAM_ID);
    } catch {
      const tx = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          fromWallet,
          fromATA,
          fromWallet,
          BRATE_MINT,
          TOKEN_2022_PROGRAM_ID
        )
      );
      await connection.sendTransaction(tx, [fromKeypair]);
    }

    // Crear/verificar ATA de comprador
    const toATA = await getAssociatedTokenAddress(
      BRATE_MINT,
      buyerPubkey,
      false,
      TOKEN_2022_PROGRAM_ID
    );
    try {
      await getAccount(connection, toATA, undefined, TOKEN_2022_PROGRAM_ID);
    } catch {
      const tx = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          fromWallet,
          toATA,
          buyerPubkey,
          BRATE_MINT,
          TOKEN_2022_PROGRAM_ID
        )
      );
      await connection.sendTransaction(tx, [fromKeypair]);
    }

    // Transferir tokens
    const sig = await transfer(
      connection,
      fromKeypair,
      fromATA,
      toATA,
      fromWallet,
      brateInSmallestUnit,
      [],
      undefined,
      TOKEN_2022_PROGRAM_ID
    );

    return NextResponse.json({
      success: true,
      signature: sig,
      solscan: `https://solscan.io/tx/${sig}`,
      message: `${brateAmount.toLocaleString()} BRATE enviados a ${buyer}`,
    });
  } catch (err: any) {
    console.error("Error en buy-brate:", err.message);
    return NextResponse.json({ error: err.message || "Error desconocido" }, { status: 500 });
  }
}
