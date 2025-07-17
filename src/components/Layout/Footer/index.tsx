"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";

const Footer = () => {
  return (
    <footer className="bg-darkmode pt-10 pb-8 text-center text-white text-sm relative">
      {/* Logo */}
      <div className="mb-2">
        <Link href="/" aria-label="Brate Home">
          <Image
            src="/images/footer/logo-footer.png"
            alt="Brate Logo"
            width={100}
            height={40}
            className="mx-auto hover:opacity-80 transition-opacity"
          />
        </Link>
      </div>

      {/* Disclaimer text */}
      <p className="text-white text-[13px] max-w-3xl mx-auto px-4 leading-relaxed mb-6">
        Cryptocurrency investments carry high volatility risk. Gains may be subject to capital gains or local taxes. Regulations vary — make sure you understand your jurisdiction’s rules. Always do your own research and only invest what you can afford to lose.
      </p>

      {/* Menu links */}
      <nav className="flex flex-wrap justify-center gap-6 mb-6 text-sm text-white">
        <Link href="/#what-is-brate" className="hover:text-primary">What is BRATE</Link>
        <Link href="/#tokenomics" className="hover:text-primary">Tokenomics</Link>
        <Link href="/#how-it-works" className="hover:text-primary">How It Works</Link>
        <Link href="/transparency" className="hover:text-primary">Transparency</Link>
        <Link href="/whitepaper.pdf" target="_blank" className="hover:text-primary">Whitepaper</Link>
      </nav>

      {/* Social media */}
      <div className="flex justify-center gap-6 mb-6">
        <Link href="https://discord.gg/F3AfxkkAcv" aria-label="Discord">
          <Icon icon="fa6-brands:discord" width={22} height={22} className="text-white hover:text-primary" />
        </Link>
        <Link href="https://x.com/BrateAI" aria-label="X">
          <Icon icon="fa6-brands:x-twitter" width={22} height={22} className="text-white hover:text-primary" />
        </Link>
        <Link href="https://t.me/BrateAIOficial" aria-label="Telegram">
          <Icon icon="fa6-brands:telegram" width={22} height={22} className="text-white hover:text-primary" />
        </Link>
      </div>

      {/* Copyright */}
      <p className="text-xs text-white mt-4">
        © 2025 BRATE. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

