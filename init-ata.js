import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddress,
  getAccount,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import dotenv from "dotenv";

dotenv.config();

const RPC = process.env.NEXT_PUBLIC_HELIUS_RPC;
const MINT_ADDRESS = process.env.MINT_ADDRESS;
const PRIVATE_KEY = JSON.parse(process.env.PRIVATE_KEY);

async function main() {
  try {
    const connection = new Connection(RPC, "confirmed");
    const payer = Keypair.fromSecretKey(Uint8Array.from(PRIVATE_KEY));
    console.log("Wallet emisora:", payer.publicKey.toBase58());

    const mint = new PublicKey(MINT_ADDRESS);

    // Dirección de la cuenta asociada
    const ata = await getAssociatedTokenAddress(
      mint,
      payer.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    console.log("Creando/verificando ATA en:", ata.toBase58());

    // Verificar si ya existe
    try {
      await getAccount(connection, ata, undefined, TOKEN_2022_PROGRAM_ID);
      console.log("ATA ya existe, no es necesario crearla.");
      return;
    } catch {
      console.log("ATA no existe, creando...");
    }

    // Crear instrucción para ATA
    const ix = createAssociatedTokenAccountInstruction(
      payer.publicKey,   // payer
      ata,               // cuenta asociada
      payer.publicKey,   // dueño de la cuenta
      mint,              // mint
      TOKEN_2022_PROGRAM_ID
    );

    const tx = new Transaction().add(ix);

    const sig = await sendAndConfirmTransaction(connection, tx, [payer]);
    console.log("ATA creada con éxito:", `https://solscan.io/tx/${sig}`);
  } catch (err) {
    console.error("Error creando ATA:", err);
  }
}

main();
