// /components/EndGameSummary.tsx
"use client";

import React from "react";
import { Player } from "@/types";

export interface Debt {
  from: string;
  to: string;
  amount: number;
}

interface EndGameSummaryProps {
  players: Player[];
  onClose: () => void;
}

function calculateDebts(players: Player[]): Debt[] {
  // Create arrays of winners and losers (only include players with finalCash set)
  type PlayerWithNet = Player & { net: number };
  let winners: PlayerWithNet[] = players
    .filter((p) => p.finalCash !== null)
    .map((p) => ({ ...p, net: p.finalCash! - p.totalBuyIn }))
    .filter((p) => p.net > 0)
    .sort((a, b) => b.net - a.net);
  let losers: PlayerWithNet[] = players
    .filter((p) => p.finalCash !== null)
    .map((p) => ({ ...p, net: p.finalCash! - p.totalBuyIn }))
    .filter((p) => p.net < 0)
    .sort((a, b) => a.net - b.net);

  const transactions: Debt[] = [];

  while (winners.length > 0 && losers.length > 0) {
    const winner = winners[0];
    const loser = losers[0];
    const amount = Math.min(winner.net, -loser.net);
    transactions.push({ from: loser.name, to: winner.name, amount });
    winner.net -= amount;
    loser.net += amount;
    if (Math.abs(winner.net) < 0.01) {
      winners.shift();
    }
    if (Math.abs(loser.net) < 0.01) {
      losers.shift();
    }
  }
  return transactions;
}

export default function EndGameSummary({
  players,
  onClose,
}: EndGameSummaryProps) {
  const debts = calculateDebts(players);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="end-game-summary-title"
    >
      <div className="bg-gray-800 p-6 rounded shadow-lg max-w-2xl w-full">
        <h2 id="end-game-summary-title" className="text-2xl font-bold mb-4">
          End Game Summary - Who Owes What
        </h2>
        {debts.length === 0 ? (
          <p className="mb-4">No transactions needed. Everyone is settled!</p>
        ) : (
          <table className="w-full table-auto mb-4">
            <thead>
              <tr>
                <th className="border p-2">From</th>
                <th className="border p-2">To</th>
                <th className="border p-2">Amount ($)</th>
              </tr>
            </thead>
            <tbody>
              {debts.map((debt, index) => (
                <tr key={index}>
                  <td className="border p-2">{debt.from}</td>
                  <td className="border p-2">{debt.to}</td>
                  <td className="border p-2">{debt.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Close End Game Summary"
        >
          Close
        </button>
      </div>
    </div>
  );
}