// src/global.d.ts
import type { PublicKey, Transaction } from "@solana/web3.js";

interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: PublicKey;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
}

interface Window {
  solana?: PhantomProvider;
}
