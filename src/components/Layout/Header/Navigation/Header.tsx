"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { headerData } from "./menuData";
import Logo from "../Logo";
import HeaderLink from "./HeaderLink";
import MobileHeaderLink from "./MobileHeaderLink";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Header: React.FC = () => {
  const pathUrl = usePathname();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { connected } = useWallet();

  const handleScroll = () => setSticky(window.scrollY >= 80);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node) &&
      navbarOpen
    ) {
      setNavbarOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navbarOpen]);

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-all duration-300 ${
        sticky ? "shadow-lg bg-darkmode pt-4" : "shadow-none pt-6"
      }`}
    >
      <div className="container mx-auto max-w-screen-xl px-4">
        <div className="flex items-center justify-between">
          <Logo />

          {/* Navegación principal */}
          <nav className="hidden lg:flex flex-grow items-center justify-center gap-6 text-sm">
            {headerData.map((item, index) => (
              <HeaderLink key={index} item={item} />
            ))}
          </nav>

          {/* Botón de wallet y menú móvil */}
          <div className="flex items-center gap-3">
            {!connected && (
              <WalletMultiButton className="hidden lg:inline-flex !min-w-fit !whitespace-nowrap !text-sm border border-[#29b6f6] text-[#29b6f6] hover:bg-[#29b6f6] hover:text-black font-medium px-6 py-2 rounded-lg transition duration-300" />
            )}
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="block lg:hidden p-2 rounded-lg"
              aria-label="Toggle mobile menu"
            >
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white mt-1.5"></span>
              <span className="block w-6 h-0.5 bg-white mt-1.5"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {navbarOpen && (
        <>
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40" />
          <div
            ref={mobileMenuRef}
            className="fixed top-0 right-0 h-full w-full bg-darkmode max-w-xs shadow-lg transform transition-transform duration-300 z-50"
          >
            <div className="flex items-center justify-between p-4">
              <Logo />
              <button
                onClick={() => setNavbarOpen(false)}
                className="text-white"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <nav className="flex flex-col items-start p-4 space-y-2">
              {headerData.map((item, index) => (
                <MobileHeaderLink key={index} item={item} />
              ))}

              {!connected && (
                <WalletMultiButton className="w-full !min-w-fit !whitespace-nowrap !text-sm border border-[#29b6f6] text-[#29b6f6] hover:bg-[#29b6f6] hover:text-black font-medium px-6 py-2 rounded-lg transition duration-300 mt-4" />
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
