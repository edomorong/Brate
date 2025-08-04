import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import dotenv from "dotenv";

dotenv.config();

// === CONFIG ===
const MINT_ADDRESS = process.env.MINT_ADDRESS;
const PRIVATE_KEY = JSON.parse(process.env.PRIVATE_KEY); // Asegúrate que sea array
const RPC = process.env.NEXT_PUBLIC_HELIUS_RPC;

async function main() {
  try {
    const connection = new Connection(RPC, "confirmed");
    const mint = new PublicKey(MINT_ADDRESS);
    const payer = Keypair.fromSecretKey(Uint8Array.from(PRIVATE_KEY));

    console.log("Wallet emisora:", payer.publicKey.toBase58());

    // --- Verificar cuenta asociada del emisor
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      payer.publicKey
    );

    console.log("Cuenta token del emisor:", fromTokenAccount.address.toBase58());

    // --- Verificar saldo
    console.log("Saldo actual del emisor:", fromTokenAccount.amount.toString());

    // --- Crear cuenta destino (usa una pública de prueba tuya)
    const destino = new PublicKey("TU_PUBLIC_KEY_DE_PRUEBA_AQUI"); // cámbiala por tu wallet Phantom

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      destino
    );

    console.log("Cuenta token del receptor:", toTokenAccount.address.toBase58());

    // --- Transferir 1 token (ajusta si tiene decimales)
    const cantidad = 1_000_000; // 1 token si tiene 6 decimales
    const sig = await transfer(
      connection,
      payer,
      fromTokenAccount.address,
      toTokenAccount.address,
      payer.publicKey,
      cantidad
    );

    console.log("Transferencia enviada:", `https://solscan.io/tx/${sig}`);
  } catch (e) {
    console.error("Error en prueba directa:", e);
  }
}

main();
