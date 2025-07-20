// components/SEOHead.tsx
import Head from "next/head";

const SEOHead = () => (
  <Head>
    <title>BRATE | Crypto Social AI App</title>
    <meta name="description" content="BRATE is an AI-powered crypto-social platform where you earn rewards, pay, and explore Web3. Join the most disruptive token launch today!" />
    <meta name="keywords" content="BRATE, crypto, AI social app, solana, token, buy crypto, blockchain, holders, staking, Web3" />
    <meta name="author" content="BRATE Team" />
    <meta name="robots" content="index, follow" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    {/* Open Graph / Facebook */}
    <meta property="og:title" content="Join BRATE - The AI-Powered Crypto Social App" />
    <meta property="og:description" content="Buy $BRATE today and join a community where crypto meets real world utility. Limited early holders get exclusive rewards!" />
    <meta property="og:image" content="https://gobrate.com/images/og-image.png" />
    <meta property="og:url" content="https://gobrate.com/" />
    <meta property="og:type" content="website" />

    {/* Twitter Meta Tags */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="BRATE | AI-Powered Crypto App" />
    <meta name="twitter:description" content="Join BRATE and explore how AI, Solana and community rewards merge into one powerful crypto-social tool." />
    <meta name="twitter:image" content="https://gobrate.com/images/og-image.png" />

    {/* Favicon & Manifest */}
    <link rel="icon" href="/favicon.ico" />
    <link rel="manifest" href="/manifest.json" />
  </Head>
);

export default SEOHead;
