import React from "react";

const VideoBanner = () => {
  return (
    <section className="bg-black py-16 relative">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
          See How BRATE Transforms Reality
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
          Discover how BRATE merges AI, crypto rewards, and real-world experiences
          to elevate your digital journey.
        </p>
        <div className="relative w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-xl">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-auto"
            preload="none"
          >
            <source src="/videos/WhatIsBrate.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default VideoBanner;
