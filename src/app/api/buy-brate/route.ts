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

// --- Configuración desde .env ---
const BRATE_MINT = new PublicKey(process.env.MINT_ADDRESS!);
const DECIMALS = 1_000_000_000; // 9 decimales
const BRATE_PER_SOL = parseInt(process.env.BRATE_PER_SOL || "15000", 10); // 0.01 SOL = 15,000 BRATE
const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY!;

function getPrivateKey(): Uint8Array {
  const arr = JSON.parse(process.env.PRIVATE_KEY || "[]");
  return Uint8Array.from(arr);
}

// --- Verificar número de holders ---
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
    const { buyer, solAmount } = await req.json();

    // Validaciones
    if (!buyer || typeof solAmount !== "number" || solAmount <= 0) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    const connection = new Connection(
      process.env.NEXT_PUBLIC_HELIUS_RPC!,
      "confirmed"
    );

    // Calcular tokens BRATE
    let brateAmount = solAmount * BRATE_PER_SOL; // Ejemplo: 0.01 SOL -> 15,000

    // Bono del 10% para los primeros 100 holders
    const holdersCount = await getHoldersCount();
    if (holdersCount < 100) {
      brateAmount *= 1.1; // 10% extra
    }

    const brateInSmallestUnit = Math.floor(brateAmount * DECIMALS); // en base 10^9

    // Límite máximo
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

    // --- ATA del vendedor ---
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

    // --- ATA del comprador ---
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
          fromWallet, // payer = wallet de venta
          toATA,
          buyerPubkey,
          BRATE_MINT,
          TOKEN_2022_PROGRAM_ID
        )
      );
      await connection.sendTransaction(tx, [fromKeypair]);
    }

    // --- Transferencia de BRATE ---
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
      message: `${brateAmount.toLocaleString()} BRATE enviados a ${buyer}${
        holdersCount < 100 ? " (Incluye 10% bonus por ser de los primeros 100)" : ""
      }`,
    });
  } catch (err: any) {
    console.error("Error en buy-brate:", err);
    return NextResponse.json(
      { error: err.message || "Error desconocido" },
      { status: 500 }
    );
  }
}
