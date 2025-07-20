import React from "react";
import SEOHead from "@/components/SEOHead";
import Hero from "@/components/Home/Hero";
import VideoBanner from "@/components/Home/VideoBanner";
import WhatIsBrate from "@/components/Home/WhatIsBrate";
import RaimundoZulema from "@/components/Home/raimundozulema";
import Tokenomics from "@/components/Home/tokenomics";
import Developer from "@/components/Home/developer"; // ✅ CORREGIDO
import HowItWorks from "@/components/Home/HowItWorks"; // Usa la mayúscula si el archivo se llama así
import HolderBenefits from "@/components/Home/Holders";
// import Platform from "@/components/Home/platform";
// import Portfolio from "@/components/Home/portfolio";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BRATE – Human AI Alliance",
};

export default function Home() {
  return (
    <main>
      <section id="hero">
        <Hero />
      </section>

      <section id="what-is-brate">
        <WhatIsBrate />
      </section>

      <VideoBanner />

      <section id="raimundo-zulema">
        <RaimundoZulema />
      </section>

      <section id="tokenomics">
        <Tokenomics />
      </section>

      <section id="development">
        <Developer />
      </section>

      <section id="how-it-works">
  <HowItWorks />
</section>

      <section id="holders">
        <HolderBenefits />
      </section>

      {/* <Platform /> */}
      {/* <Portfolio /> */}
    </main>
  );
}
