"use client";
import { useState } from "react";
import Link from "next/link";
import { HeaderItem } from "@/types/menu";

const MobileHeaderLink: React.FC<{ item: HeaderItem }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const hasSubItems = item.subItems?.length && item.subItems.length > 0;

  const handleToggle = () => {
    setSubmenuOpen(!submenuOpen);
  };

  return (
    <div className="relative w-full">
      {!hasSubItems ? (
        item.href ? (
          <Link
            href={item.href}
            className="flex items-center justify-between w-full py-2 text-white hover:text-[#29b6f6] transition"
            target={item.target}
          >
            {item.label}
          </Link>
        ) : (
          <span className="flex items-center justify-between w-full py-2 text-white">
            {item.label}
          </span>
        )
      ) : (
        <button
          onClick={handleToggle}
          className="flex items-center justify-between w-full py-2 text-white hover:text-[#29b6f6] transition"
        >
          {item.label}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="m7 10l5 5l5-5"
            />
          </svg>
        </button>
      )}

      {submenuOpen && hasSubItems && (
        <div className="bg-darkmode p-2 w-full border border-gray-700 rounded-md mt-1">
          {item.subItems?.map((subItem, index) => (
            <Link
              key={index}
              href={subItem.href}
              className="block py-2 text-white hover:text-[#29b6f6] transition"
            >
              {subItem.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileHeaderLink;
