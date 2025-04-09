// src/components/PlayerList.tsx
"use client";

import React from "react";
import { Player } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface PlayerListProps {
  players: Player[];
}

export default function PlayerList({ players }: PlayerListProps) {
  const calculateNet = (player: Player) => {
    if (player.finalCash === null) return 0;
    return player.finalCash - player.totalBuyIn;
  };

  const handleEdit = async (player: Player) => {
    const newBuyInStr = prompt("Edit total buy-in amount:", player.totalBuyIn.toString());
    const newBuyIn = newBuyInStr ? parseFloat(newBuyInStr) : player.totalBuyIn;

    const newFinalCashStr = prompt(
      "Edit final cash amount (leave blank to leave unchanged):",
      player.finalCash !== null ? player.finalCash.toString() : ""
    );
    const newFinalCash =
      newFinalCashStr === ""
        ? player.finalCash
        : newFinalCashStr
        ? parseFloat(newFinalCashStr)
        : player.finalCash;

    try {
      const playerRef = doc(db, "players", player.id);
      await updateDoc(playerRef, {
        totalBuyIn: newBuyIn,
        finalCash: newFinalCash,
      });
    } catch (error) {
      console.error("Error editing player:", error);
      alert("Failed to edit player. Please try again.");
    }
  };

  const handleAddMoney = async (player: Player) => {
    const amountStr = prompt("Enter additional buy-in amount:");
    if (amountStr) {
      const amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0) {
        alert("Invalid amount");
        return;
      }
      const playerRef = doc(db, "players", player.id);
      await updateDoc(playerRef, { totalBuyIn: player.totalBuyIn + amount });
    }
  };

  const handleCashOut = async (player: Player) => {
    const amountStr = prompt("Enter final cash amount:");
    if (amountStr) {
      const amount = parseFloat(amountStr);
      if (isNaN(amount)) {
        alert("Invalid amount");
        return;
      }
      const playerRef = doc(db, "players", player.id);
      await updateDoc(playerRef, { finalCash: amount });
    }
  };

  const handleRejoin = async (player: Player) => {
    const additionalBuyInStr = prompt("Enter additional buy-in amount for rejoining (leave blank for 0):");
    const additionalBuyIn = additionalBuyInStr ? parseFloat(additionalBuyInStr) : 0;

    if (isNaN(additionalBuyIn) || additionalBuyIn < 0) {
      alert("Invalid amount");
      return;
    }

    try {
      const playerRef = doc(db, "players", player.id);
      await updateDoc(playerRef, {
        finalCash: null,
        totalBuyIn: player.totalBuyIn + additionalBuyIn,
      });
    } catch (error) {
      console.error("Error rejoining player:", error);
      alert("Failed to rejoin. Please try again.");
    }
  };

  return (
    <table className="w-full table-auto mb-6 border-collapse">
      <thead>
        <tr className="bg-gray-700">
          <th className="border p-2">Name</th>
          <th className="border p-2">Total Buy-In ($)</th>
          <th className="border p-2">Final Cash ($)</th>
          <th className="border p-2">Net ($)</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player) => (
          <tr key={player.id} className="hover:bg-gray-600 transition-colors">
            <td className="border p-2">{player.name}</td>
            <td className="border p-2">{player.totalBuyIn.toFixed(2)}</td>
            <td className="border p-2">
              {player.finalCash === null ? "Active" : player.finalCash.toFixed(2)}
            </td>
            <td className="border p-2">
              {player.finalCash === null ? "—" : calculateNet(player).toFixed(2)}
            </td>
            <td className="border p-2 flex flex-col gap-2">
              <button
                onClick={() => handleEdit(player)}
                className="bg-indigo-600 hover:bg-indigo-700 px-2 py-1 rounded transition-colors"
              >
                Edit
              </button>
              {player.finalCash === null ? (
                <>
                  <button
                    onClick={() => handleAddMoney(player)}
                    className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded transition-colors"
                  >
                    Add Money
                  </button>
                  <button
                    onClick={() => handleCashOut(player)}
                    className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded transition-colors"
                  >
                    Cash Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleRejoin(player)}
                  className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition-colors"
                >
                  Rejoin
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}