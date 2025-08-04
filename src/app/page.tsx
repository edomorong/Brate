import React from "react";
import SEOHead from "@/components/SEOHead";

// Ruta real a Common/Home usando minúsculas
import Hero from "@/components/Common/Home/Hero";
import VideoBanner from "@/components/Common/Home/VideoBanner";
import WhatIsBrate from "@/components/Common/Home/WhatIsBrate";
import RaimundoZulema from "@/components/Common/Home/raimundozulema";
import Tokenomics from "@/components/Common/Home/tokenomics";
import Developer from "@/components/Common/Home/developer";
import HowItWorks from "@/components/Common/Home/HowItWorks";
import HolderBenefits from "@/components/Common/Home/Holders";
// import Platform from "@/components/Common/Home/platform";
// import Portfolio from "@/components/Common/Home/portfolio";
<link rel="icon" href="/favicon.ico" />

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
