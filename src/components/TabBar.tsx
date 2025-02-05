// /components/TabBar.tsx
"use client";

import React from "react";

interface TabBarProps {
  activeTab: "current" | "past";
  setActiveTab: (tab: "current" | "past") => void;
}

export default function TabBar({ activeTab, setActiveTab }: TabBarProps) {
  return (
    <nav aria-label="Main Navigation" className="mb-4 border-b border-gray-700">
      <ul className="flex space-x-4">
        <li>
          <button
            className={`py-2 px-4 focus:outline-none ${
              activeTab === "current"
                ? "border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("current")}
            aria-current={activeTab === "current" ? "page" : undefined}
          >
            Ledger Rankings
          </button>
        </li>
        <li>
          <button
            className={`py-2 px-4 focus:outline-none ${
              activeTab === "past"
                ? "border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("past")}
            aria-current={activeTab === "past" ? "page" : undefined}
          >
            Past Tournaments
          </button>
        </li>
      </ul>
    </nav>
  );
}