import React from "react";

const WhatIsBrate = () => {
  return (
    <section id="what-is-brate" className="py-20 bg-gradient-to-br from-[#3BBEFF] via-[#209ed4] to-[#178ebf] text-white">
    <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">WHAT IS BRATE TOKEN?</h2>
        <p className="text-lg max-w-3xl mx-auto mb-10 leading-relaxed">
          Brate Token is a next-generation utility token that powers the BRATE AI ecosystem — an advanced AI-based application designed to connect people, culture, and commerce. 
          More than a cryptocurrency, it's a gateway to a decentralized network where users can interact with AI avatars, make real-world payments, access geo-based experiences, and benefit from community-driven rewards. 
          Supporting NFT integrations and future-ready technology, Brate sets a new standard for digital engagement and real-world utility.
        </p>
        <div className="flex justify-center">
          <video
            src="/videos/baner.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="rounded-lg shadow-xl w-full max-w-3xl"
          />
        </div>
      </div>
    </section>
  );
};

export default WhatIsBrate;

