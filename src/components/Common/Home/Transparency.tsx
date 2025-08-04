"use client";

import React from "react";
import { motion } from "framer-motion";

const TransparencyPage = () => {
  const allocations = [
    {
      category: "Airdrop Phase 1",
      percent: "15%",
      amount: "150,000,000",
      wallet: "FwS4hbT9YKH7Mg8NB7F6NznNx2SKezsezHojDegns9Fx",
      sent: "0",
      remaining: "150,000,000",
      condition: "Q1 2026 – After organic growth and staking",
    },
    {
      category: "Airdrop Phase 2",
      percent: "10%",
      amount: "100,000,000",
      wallet: "C7se5tEB8k2ji1TQWHP7qeU8gssJWkFxoKJZWvTQpv6j",
      sent: "0",
      remaining: "100,000,000",
      condition: "Q2 2026 – For testers and strategic partners",
    },
    {
      category: "Staking & Rewards",
      percent: "20%",
      amount: "200,000,000",
      wallet: "GfcUazNdPaKuiYzzQV5sy5Ly3vspsL146RdfMcz9SLdS",
      sent: "0",
      remaining: "200,000,000",
      condition: "Q4 2025 to Q4 2026",
    },
    {
      category: "Initial Liquidity",
      percent: "15%",
      amount: "150,000,000",
      wallet: "7vPwgHYpdwXiqoRy25uAUat1WdH8CXdueVUTDbDkgiGF",
      sent: "0",
      remaining: "150,000,000",
      condition: "Q1 2026 – MVP Launch",
    },
    {
      category: "Project Development",
      percent: "15%",
      amount: "150,000,000",
      wallet: "EeRCvMor65Nia8Gn7BBPKsJZEfPPsJW2nUE79mtjHos5",
      sent: "0",
      remaining: "150,000,000",
      condition: "Q3 2025 to Q2 2027",
    },
    {
      category: "Strategic Reserves",
      percent: "10%",
      amount: "100,000,000",
      wallet: "C7okbTSRzLVs98BdQjsSPzvAArSqSoGasjr4stab9HQS",
      sent: "0",
      remaining: "100,000,000",
      condition: "Multisig custody – gradual release",
    },
    {
      category: "Founding Team",
      percent: "15%",
      amount: "150,000,000",
      wallet: "4CqNmVe3aDfRsQHBh4zF6PHZsTz9aSNkgScDmJzS1sNH",
      sent: "0",
      remaining: "150,000,000",
      condition: "Locked until Q2 2027 – linear unlocking",
    },
  ];

  return (
    <section className="bg-background text-white pt-32 pb-20 px-4 md:px-10">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold">Transparency & Token Distribution</h1>
          <p className="mt-4 text-lg text-gray-300">
            This page shows the real-time distribution status of the $BRATE token
            aligned with our roadmap and community commitments.
          </p>
          <p className="mt-2 text-sm text-gray-400 max-w-3xl mx-auto">
            All wallets are public and verifiable on-chain via Solscan. No private sales, no hidden allocations.
            Every phase is pre-defined and tied to development milestones or community growth targets.
          </p>
        </motion.div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-cyan-500 text-darkmode">
                <th className="p-3 font-semibold">Category</th>
                <th className="p-3 font-semibold">% Allocation</th>
                <th className="p-3 font-semibold">Token Amount</th>
                <th className="p-3 font-semibold">Wallet Address</th>
                <th className="p-3 font-semibold">Sent</th>
                <th className="p-3 font-semibold">Remaining</th>
                <th className="p-3 font-semibold">Condition</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((row, i) => (
                <tr
                  key={i}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="p-3 font-medium">{row.category}</td>
                  <td className="p-3">{row.percent}</td>
                  <td className="p-3">{row.amount}</td>
                  <td className="p-3 break-all text-cyan-400">
                    <a
                      href={`https://solscan.io/account/${row.wallet}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {row.wallet}
                    </a>
                  </td>
                  <td className="p-3">{row.sent}</td>
                  <td className="p-3">{row.remaining}</td>
                  <td className="p-3 text-sm text-gray-300">{row.condition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default TransparencyPage;
