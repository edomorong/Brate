"use client";

import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/images/logo/logo.png" // ✅ Ruta corregida aquí
        alt="BRATE"
        width={80}
        height={80}
        className="mr-2"
      />
      <span className="font-bold text-white text-lg">BRATE</span>
    </Link>
  );
};

export default Logo;
