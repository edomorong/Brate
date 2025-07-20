"use client";

import { ReactNode } from "react";
import { DM_Sans } from "next/font/google";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

import Header from "@/components/Layout/Header/Navigation/Header";
import Footer from "@/components/Layout/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Aoscompo from "@/utils/aos";
import "@/style.css";
import "@solana/wallet-adapter-react-ui/styles.css";

const font = DM_Sans({ subsets: ["latin"] });

// ✅ Usa variable de entorno segura
const endpoint = process.env.NEXT_PUBLIC_HELIUS_RPC || "";

const wallets = [new PhantomWalletAdapter()];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <Aoscompo>
                <Header />
                {children}
                <Footer />
              </Aoscompo>
              <ScrollToTop />
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  );
}
