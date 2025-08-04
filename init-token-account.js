import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import dotenv from "dotenv";

dotenv.config();

const MINT_ADDRESS = process.env.MINT_ADDRESS;
const PRIVATE_KEY = JSON.parse(process.env.PRIVATE_KEY);
const RPC = process.env.NEXT_PUBLIC_HELIUS_RPC;

async function main() {
  try {
    const connection = new Connection(RPC, "confirmed");
    const mint = new PublicKey(MINT_ADDRESS);
    const payer = Keypair.fromSecretKey(Uint8Array.from(PRIVATE_KEY));

    console.log("Wallet emisora:", payer.publicKey.toBase58());

    // Crear o obtener cuenta asociada del token
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      payer.publicKey
    );

    console.log("Cuenta token creada/obtenida:", tokenAccount.address.toBase58());
    console.log("Saldo actual BRATE:", tokenAccount.amount.toString());
  } catch (e) {
    console.error("Error creando/verificando cuenta:", e);
  }
}

main();
