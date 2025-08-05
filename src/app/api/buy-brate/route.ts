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
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

const mintAddress = process.env.NEXT_PUBLIC_MINT_ADDRESS;
if (!mintAddress) {
  throw new Error("NEXT_PUBLIC_MINT_ADDRESS no está configurado en variables de entorno");
}
const BRATE_MINT = new PublicKey(mintAddress);

const DECIMALS = 1_000_000_000;
const BRATE_PER_SOL = parseInt(process.env.BRATE_PER_SOL || "15000", 10);
const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY || "";

function getPrivateKey(): Uint8Array {
  const arr = JSON.parse(process.env.PRIVATE_KEY || "[]");
  return Uint8Array.from(arr);
}

async function getHoldersCount(): Promise<number> {
  try {
    const res = await fetch(
      `https://api.helius.xyz/v0/token-metadata?api-key=${HELIUS_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mintAccounts: [BRATE_MINT.toString()] }),
      }
    );

    const data = await res.json();
    return data?.[0]?.tokenInfo?.holders || 0;
  } catch (e) {
    console.error("Error obteniendo holders:", e);
    return 0;
  }
}

export async function POST(req: Request) {
  try {
    const { buyer, solAmount } = (await req.json()) as {
      buyer: string;
      solAmount: number;
    };

    if (!buyer || typeof solAmount !== "number" || solAmount <= 0) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    const connection = new Connection(process.env.NEXT_PUBLIC_HELIUS_RPC!, "confirmed");

    let brateAmount = solAmount * BRATE_PER_SOL;
    const holdersCount = await getHoldersCount();
    if (holdersCount < 100) {
      brateAmount *= 1.1;
    }

    const brateInSmallestUnit = Math.floor(brateAmount * DECIMALS);

    const maxBrate = parseInt(process.env.MAX_BRATE || "1000000", 10);
    if (brateAmount > maxBrate) {
      return NextResponse.json(
        { error: "Supera el límite máximo permitido por compra" },
        { status: 400 }
      );
    }

    const fromKeypair = Keypair.fromSecretKey(getPrivateKey());
    const fromWallet = fromKeypair.publicKey;
    const buyerPubkey = new PublicKey(buyer);

    const fromATA = await getAssociatedTokenAddress(
      BRATE_MINT,
      fromWallet,
      false,
      TOKEN_PROGRAM_ID
    );

    try {
      await getAccount(connection, fromATA, undefined, TOKEN_PROGRAM_ID);
    } catch {
      const tx = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          fromWallet,
          fromATA,
          fromWallet,
          BRATE_MINT,
          TOKEN_PROGRAM_ID
        )
      );
      await connection.sendTransaction(tx, [fromKeypair]);
    }

    const toATA = await getAssociatedTokenAddress(
      BRATE_MINT,
      buyerPubkey,
      false,
      TOKEN_PROGRAM_ID
    );

    try {
      await getAccount(connection, toATA, undefined, TOKEN_PROGRAM_ID);
    } catch {
      const tx = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          fromWallet,
          toATA,
          buyerPubkey,
          BRATE_MINT,
          TOKEN_PROGRAM_ID
        )
      );
      await connection.sendTransaction(tx, [fromKeypair]);
    }

    const sig = await transfer(
      connection,
      fromKeypair,
      fromATA,
      toATA,
      fromWallet,
      brateInSmallestUnit,
      [],
      undefined,
      TOKEN_PROGRAM_ID
    );

    return NextResponse.json({
      success: true,
      signature: sig,
      solscan: `https://solscan.io/tx/${sig}`,
      message: `${brateAmount.toLocaleString()} BRATE enviados a ${buyer}${
        holdersCount < 100 ? " (Incluye 10% bonus por ser de los primeros 100)" : ""
      }`,
    });
  } catch (err) {
    const error = err as Error;
    console.error("Error en buy-brate:", error);
    return NextResponse.json(
      { error: error.message || "Error desconocido" },
      { status: 500 }
    );
  }
}
