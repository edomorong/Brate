import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import dotenv from "dotenv";

dotenv.config();

// === VARIABLES DE ENTORNO ===
const RPC = process.env.NEXT_PUBLIC_HELIUS_RPC;
const MINT_ADDRESS = process.env.MINT_ADDRESS;
const PRIVATE_KEY = JSON.parse(process.env.PRIVATE_KEY);

// === FUNCIÓN PRINCIPAL ===
(async () => {
  try {
    const connection = new Connection(RPC, "confirmed");

    const fromKeypair = Keypair.fromSecretKey(Uint8Array.from(PRIVATE_KEY));
    console.log("Wallet emisora:", fromKeypair.publicKey.toBase58());

    const mintPubkey = new PublicKey(MINT_ADDRESS);

    // Crear/verificar cuenta asociada del token
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromKeypair,
      mintPubkey,
      fromKeypair.publicKey // La cuenta emisora
    );

    console.log("Cuenta asociada creada/verificada:", tokenAccount.address.toBase58());
  } catch (err) {
    console.error("Error creando/verificando cuenta:", err);
  }
})();
