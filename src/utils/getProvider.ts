import type { PhantomProvider } from "../types/phantom"; // Ruta relativa correcta


export default function getProvider(): PhantomProvider | null {
  if (typeof window === "undefined") return null;

  const anyWindow = window as any;
  if ("solana" in anyWindow) {
    const provider = anyWindow.solana as PhantomProvider;
    if (provider?.isPhantom) {
      return provider;
    }
  }

  return null;
}
