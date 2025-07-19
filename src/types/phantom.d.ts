import type { PublicKey, Transaction } from "@solana/web3.js";

export interface PhantomProvider {
  isPhantom: boolean;
  publicKey: PublicKey;
  connect: (opts?: { onlyIfTrusted: boolean }) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>;
  signAndSendTransaction?: (transaction: Transaction) => Promise<{ signature: string }>;
}
