// src/utils/getProvider.ts
import type { PhantomProvider } from "../global";

const getProvider = (): PhantomProvider | null => {
  if ("solana" in window) {
    const provider = window.solana as PhantomProvider;
    if (provider?.isPhantom) {
      return provider;
    }
  }
  return null;
};

export default getProvider;
