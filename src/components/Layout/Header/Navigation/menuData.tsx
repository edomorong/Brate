import { HeaderItem } from "@/types/menu";

export const headerData: HeaderItem[] = [
  { label: "Home", href: "/#hero" },

  {
    label: "BRATE",
    href: "#",
    subItems: [
      { label: "What is BRATE", href: "/#what-is-brate" },
      { label: "Raimundo & Zulema", href: "/#raimundo-zulema" },
      { label: "Tokens", href: "/#tokenomics" },
    ],
  },

  // 🔵 Reemplazo de Development con subItems por un solo botón
 {
  label: "Developers",
  href: "/#developers"
},

  { label: "How it Works", href: "/#how-it-works" },
  { label: "Holders", href: "/#holders" },

  {
    label: "Whitepaper",
    href: "/whitepaper.pdf",
    external: true,
    target: "_blank",
  },
];
