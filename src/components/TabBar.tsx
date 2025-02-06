// /components/TabBar.tsx
"use client";

import React from "react";

interface TabBarProps {
  activeTab: "ledger" | "pastTournaments";
  setActiveTab: (tab: "ledger" | "pastTournaments") => void;
}

export default function TabBar({ activeTab, setActiveTab }: TabBarProps) {
  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="container mx-auto flex justify-center gap-6 py-3">
        <button
          onClick={() => setActiveTab("ledger")}
          className={`px-4 py-2 rounded transition ${
            activeTab === "ledger"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-gray-300"
          }`}
          aria-current={activeTab === "ledger" ? "page" : undefined}
        >
          Ledger Rankings
        </button>
        <button
          onClick={() => setActiveTab("pastTournaments")}
          className={`px-4 py-2 rounded transition ${
            activeTab === "pastTournaments"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-gray-300"
          }`}
          aria-current={activeTab === "pastTournaments" ? "page" : undefined}
        >
          Past Tournaments
        </button>
      </div>
    </nav>
  );
}
