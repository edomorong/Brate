"use client";
import Image from "next/image";
import Link from "next/link";

const HowItWorks = () => {
  return (
    <section className="py-24" id="how-it-works">
      <div className="container mx-auto px-4 flex flex-col-reverse lg:flex-row-reverse items-center gap-12">
        
        {/* Texto */}
        <div className="lg:w-1/2 text-white">
          <h2 className="text-4xl font-bold text-white mb-6">
  Holder Benefits in the BRATE Ecosystem
</h2>
<p className="text-white text-lg mb-6">
  Unlock real advantages by holding BRATE tokens. From early access, exclusive campaigns, and governance impact — every type of holder gains meaningful rewards in our growing AI + blockchain network.
</p>

<ul className="space-y-4 text-white text-base border-l-2 border-cyan-400 pl-4">
  <li>
    <span className="text-cyan-400">●</span> <strong>Holding $BRATE:</strong> Access to premium features, events, staking, and exclusive rewards.
  </li>
  <li>
    <span className="text-cyan-400">●</span> <strong>Holding $ZULE / $RAIM:</strong> Participation in exclusive campaigns and themed NFT drops.
  </li>
  <li>
    <span className="text-cyan-400">●</span> <strong>Early Holder:</strong> Limited airdrops and priority in new launches and integrations.
  </li>
  <li>
    <span className="text-cyan-400">●</span> <strong>Stakers:</strong> Progressive rewards and early access to new versions.
  </li>
  <li>
    <span className="text-cyan-400">●</span> <strong>DAO Voters:</strong> Direct influence over roadmap, integrations, and partnerships.
  </li>
</ul>
          
        </div>

        {/* Imagen */}
        <div className="lg:w-1/2 flex justify-center">
          <Image
            src="/images/hero/holder-benefits.png"
            alt="How It Works BRATE"
            width={600}
            height={400}
            className="rounded-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
