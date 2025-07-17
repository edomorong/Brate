"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderItem } from "@/types/menu";

const HeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  let timeout: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(timeout);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeout = setTimeout(() => setOpen(false), 200);
  };

  const isActive = pathname === item.href;

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.href ? (
        <Link
          href={item.href}
          target={item.target}
          className={`px-4 py-2 rounded-md transition-colors duration-150 ${
            isActive ? "text-[#38bdf8]" : "text-white"
          } hover:text-[#38bdf8]`}
        >
          {item.label}
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-md text-white cursor-not-allowed opacity-60">
          {item.label}
        </span>
      )}

      {item.subItems && item.subItems.length > 0 && open && (
        <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-2xl shadow-lg z-50">
          <ul className="flex flex-col p-2 min-w-[180px]">
            {item.subItems.map((subItem, idx) => (
              <li key={idx}>
                {subItem.href ? (
                  <Link
                    href={subItem.href}
                    className="block px-4 py-2 text-white hover:text-[#38bdf8] hover:bg-muted rounded-md transition-colors duration-150"
                  >
                    {subItem.label}
                  </Link>
                ) : (
                  <span className="block px-4 py-2 text-white opacity-60 cursor-not-allowed">
                    {subItem.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HeaderLink;
