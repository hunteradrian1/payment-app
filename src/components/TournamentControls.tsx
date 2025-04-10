// src/components/TournamentControls.tsx
"use client";

import React, { useState, FormEvent } from "react";
import { collection, getDocs, deleteDoc, addDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Player } from "@/types";
import { updateUserStats } from "@/lib/updateUserStats";

interface TournamentControlsProps {
  players: Player[];
}

export default function TournamentControls({ players }: TournamentControlsProps) {
  const [tournamentName, setTournamentName] = useState("Tournament");

  // End the tournament by saving a snapshot of the current players and updating leaderboard stats.
  const handleEndGame = async (e: FormEvent) => {
    e.preventDefault();
    if (!tournamentName.trim()) {
      alert("Please provide a tournament name before ending the game.");
      return;
    }
    try {
      // Save the tournament snapshot in Firestore.
      await addDoc(collection(db, "tournaments"), {
        name: tournamentName.trim(),
        date: new Date().toISOString(),
        players: players || [],
      });

      // For each player with a final result, update leaderboard stats.
      // Only update players whose finalCash is not null.
      for (const player of players) {
        if (player.finalCash !== null) {
          const net = player.finalCash - player.totalBuyIn;
          const won = net > 0;
          // If a player has a Firebase Auth UID, use that, otherwise use the player document id.
          const userId = player.uid ?? player.id;
          await updateUserStats(userId, player.name, net, won);
        }
      }

      alert(`Tournament "${tournamentName}" ended and saved.`);
      setTournamentName("Tournament");
    } catch (error) {
      console.error("Error ending tournament:", error);
      alert("Failed to end tournament. Please try again.");
    }
  };

  // Reset the tournament by deleting all players from Firestore.
  const handleResetTournament = async () => {
    if (confirm("Are you sure you want to reset the tournament? This will remove all players.")) {
      try {
        const playersSnapshot = await getDocs(collection(db, "players"));
        const deletePromises = playersSnapshot.docs.map((document) =>
          deleteDoc(doc(db, "players", document.id))
        );
        await Promise.all(deletePromises);
        alert("Tournament reset successfully. All players have been removed.");
      } catch (error) {
        console.error("Error resetting tournament:", error);
        alert("Failed to reset tournament. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mt-6">
      <form
        onSubmit={handleEndGame}
        className="flex flex-col md:flex-row items-end gap-4"
        aria-label="End Tournament"
      >
        <div className="flex flex-col">
          <label htmlFor="tournamentName" className="mb-1">Tournament Name</label>
          <input
            id="tournamentName"
            type="text"
            value={tournamentName}
            onChange={(e) => setTournamentName(e.target.value)}
            className="px-3 py-2 rounded text-gray-900"
            placeholder="Enter tournament name"
            required
          />
        </div>
        <button type="submit" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition-colors">
          End Game
        </button>
      </form>
      <button
        onClick={handleResetTournament}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
        aria-label="Reset Tournament"
      >
        Reset Tournament
      </button>
    </div>
  );
}