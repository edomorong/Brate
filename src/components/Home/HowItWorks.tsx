"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { getImagePrefix } from "@/utils/utils";

const HowItWorks = () => {
  const brateWallet = "7vPwgHYmLVGiLbuwrdskchKtpPbwY91efcfxgkeVVD9L";

  const handleBuyClick = async () => {
    try {
      const provider = (window as any).solana;
      if (provider && provider.isPhantom) {
        const res = await provider.connect();
        const userPublicKey = res.publicKey;

        const connection = new (window as any).solanaWeb3.Connection(
          "https://api.mainnet-beta.solana.com"
        );
        const { SystemProgram, Transaction, PublicKey } =
          (window as any).solanaWeb3;

        const lamports = 10000000; // 0.01 SOL
        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: new PublicKey(userPublicKey),
            toPubkey: new PublicKey(brateWallet),
            lamports,
          })
        );

        const signed = await provider.signTransaction(transaction);
        const signature = await connection.sendRawTransaction(
          signed.serialize()
        );

        const sol = lamports / 1e9;
        const estimatedBRATE = sol / 0.0000005;
        const explorerLink = `https://solscan.io/tx/${signature}`;

        await fetch("/api/notify-discord", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sol,
            brate: estimatedBRATE,
            wallet: userPublicKey.toString(),
            tx: explorerLink,
          }),
        });

        alert(`✅ Compra enviada! TX: ${explorerLink}`);
      } else {
        window.open("https://phantom.app/", "_blank");
      }
    } catch (err) {
      console.error("Connection error:", err);
      alert("⚠️ Error al procesar la compra.");
    }
  };

  return (
    <section className="py-20 bg-background" id="how-it-works">
      <div className="container mx-auto px-6 lg:px-20 grid md:grid-cols-2 gap-14 items-center">
        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-white text-4xl font-bold mb-6">
            How It Works: Real AI in Real Life
          </h2>
          <p className="text-white text-lg mb-8">
            Discover how BRATE transforms daily experiences through augmented
            reality, blockchain, and smart assistants — all powered by $BRATE.
            From smart glasses to immersive city interactions, we bring AI into
            your world.
          </p>

          {/* ✅ Buy Button Actualizado */}
          <div className="flex justify-center">
            <button
              onClick={handleBuyClick}
              className="border border-[#38bdf8] text-[#38bdf8] font-medium text-lg px-7 py-3 rounded-lg hover:bg-[#38bdf8] hover:text-darkmode transition duration-300"
            >
              Buy Crypto
            </button>
          </div>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <Image
            src={`${getImagePrefix()}images/hero/how-it-works-brate.png`}
            alt="How it works illustration"
            width={580}
            height={400}
            className="rounded-xl shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
