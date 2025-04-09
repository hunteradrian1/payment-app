// src/components/TabBar.tsx
"use client";

import React from "react";

export type DashboardTab = "ledger" | "pastTournaments" | "leaderboard";

interface TabBarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
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
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`px-4 py-2 rounded transition ${
            activeTab === "leaderboard"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-gray-300"
          }`}
          aria-current={activeTab === "leaderboard" ? "page" : undefined}
        >
          Leaderboard
        </button>
      </div>
    </nav>
  );
}