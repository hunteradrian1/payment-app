// /components/PlayerList.tsx
"use client";

import React from "react";
import { Player } from "@/types";

interface PlayerListProps {
  players: Player[];
  updatePlayers: (players: Player[]) => void;
}

export default function PlayerList({
  players,
  updatePlayers,
}: PlayerListProps) {
  const calculateNet = (player: Player) => {
    if (player.finalCash === null) return 0;
    return player.finalCash - player.totalBuyIn;
  };

  const handleRebuy = (playerId: number) => {
    const amountStr = prompt("Enter additional buy-in amount:");
    if (amountStr) {
      const amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0) {
        alert("Invalid amount");
        return;
      }
      const updated = players.map((player) => {
        if (player.id === playerId && player.finalCash === null) {
          return { ...player, totalBuyIn: player.totalBuyIn + amount };
        }
        return player;
      });
      updatePlayers(updated);
    }
  };

  const handleSetFinalCash = (playerId: number) => {
    const amountStr = prompt("Enter final cash amount:");
    if (amountStr) {
      const amount = parseFloat(amountStr);
      if (isNaN(amount)) {
        alert("Invalid amount");
        return;
      }
      const updated = players.map((player) => {
        if (player.id === playerId && player.finalCash === null) {
          return { ...player, finalCash: amount };
        }
        return player;
      });
      updatePlayers(updated);
    }
  };

  const handleRejoin = (playerId: number) => {
    const additionalBuyInStr = prompt(
      "Enter additional buy-in amount for rejoining (or leave empty for none):"
    );
    let additionalBuyIn = 0;
    if (additionalBuyInStr) {
      additionalBuyIn = parseFloat(additionalBuyInStr);
      if (isNaN(additionalBuyIn) || additionalBuyIn < 0) {
        alert("Invalid amount");
        return;
      }
    }
    const updated = players.map((player) => {
      if (player.id === playerId && player.finalCash !== null) {
        return {
          ...player,
          finalCash: null,
          totalBuyIn: player.totalBuyIn + additionalBuyIn,
        };
      }
      return player;
    });
    updatePlayers(updated);
  };

  const handleRemovePlayer = (playerId: number) => {
    if (confirm("Are you sure you want to remove this player?")) {
      updatePlayers(players.filter((player) => player.id !== playerId));
    }
  };

  return (
    <table
      className="w-full table-auto border-collapse mb-4"
      aria-label="Players List"
    >
      <thead>
        <tr>
          <th className="border p-2">Name</th>
          <th className="border p-2">Total Buy-In ($)</th>
          <th className="border p-2">Final Cash ($)</th>
          <th className="border p-2">Net ($)</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player) => (
          <tr key={player.id}>
            <td className="border p-2">{player.name}</td>
            <td className="border p-2">{player.totalBuyIn.toFixed(2)}</td>
            <td className="border p-2">
              {player.finalCash === null
                ? "Active"
                : player.finalCash.toFixed(2)}
            </td>
            <td className="border p-2">
              {player.finalCash === null ? "—" : calculateNet(player).toFixed(2)}
            </td>
            <td className="border p-2 flex flex-col gap-1">
              {player.finalCash === null ? (
                <>
                  <button
                    onClick={() => handleRebuy(player.id)}
                    className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                    aria-label={`Add rebuy for ${player.name}`}
                  >
                    Add Rebuy
                  </button>
                  <button
                    onClick={() => handleSetFinalCash(player.id)}
                    className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    aria-label={`Set final cash for ${player.name}`}
                  >
                    Set Final Cash
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleRejoin(player.id)}
                  className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label={`Rejoin ${player.name}`}
                >
                  Rejoin
                </button>
              )}
              <button
                onClick={() => handleRemovePlayer(player.id)}
                className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label={`Remove ${player.name}`}
              >
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}