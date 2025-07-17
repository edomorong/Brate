"use client";
import { useEffect, useState } from "react";
import axios from "axios";

// Dirección del token BRATE en Solana
const TOKEN_ADDRESS = "4r8dy53x7MsMfkWkwQL23byJUd19ou1LRHRR68YWzHgS";
const META_API = "https://pro-api.solscan.io/v2.0/token/meta";
const HOLDERS_API = "https://pro-api.solscan.io/v2.0/token/holders";

// Clave de API desde variables de entorno
const API_KEY = process.env.NEXT_PUBLIC_SOLSCAN_API_KEY;

type TokenMeta = {
  price: number;
  market_cap: number;
  holder: number;
};

type TokenHolder = {
  owner: string;
  amount: number;
  value: number;
};

export default function BrateStats() {
  const [meta, setMeta] = useState<TokenMeta | null>(null);
  const [holders, setHolders] = useState<TokenHolder[]>([]);

  // Cargar meta info del token
  useEffect(() => {
    async function fetchMeta() {
      try {
        const res = await axios.get(META_API, {
          params: { address: TOKEN_ADDRESS },
          headers: { Authorization: API_KEY },
        });
        setMeta(res.data.data);
      } catch (err) {
        console.error("Error fetching token metadata:", err);
      }
    }
    fetchMeta();
  }, []);

  // Cargar los 3 principales holders
  useEffect(() => {
    async function fetchTopHolders() {
      try {
        const res = await axios.get(HOLDERS_API, {
          params: { tokenAddress: TOKEN_ADDRESS, limit: 3, offset: 0 },
          headers: { Authorization: API_KEY },
        });
        setHolders(res.data.data.items);
      } catch (err) {
        console.error("Error fetching holders:", err);
      }
    }
    fetchTopHolders();
  }, []);

  if (!meta) return null;

  return (
    <div className="bg-deepSlate/70 text-white rounded-xl px-6 py-4 max-w-5xl mx-auto mt-12 backdrop-blur-sm shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
      <div>
        <p className="text-sm text-muted uppercase">Market Cap</p>
        <p className="text-3xl font-bold text-primary">
          ${meta.market_cap.toLocaleString()}
        </p>
      </div>
      <div>
        <p className="text-sm text-muted uppercase">Holders</p>
        <p className="text-3xl font-bold text-primary">
          {meta.holder.toLocaleString()}
        </p>
      </div>
      <div>
        <p className="text-sm text-muted uppercase">Top Donors</p>
        <ul className="mt-2 space-y-1">
          {holders.map((h, i) => (
            <li key={i} className="text-base text-muted-foreground">
              <code>{h.owner.slice(0, 4)}...{h.owner.slice(-4)}</code> —{" "}
              <span className="text-primary font-semibold">
                ${h.value.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}