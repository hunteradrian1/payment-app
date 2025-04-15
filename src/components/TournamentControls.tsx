"use client";

import React, { useState, FormEvent } from "react";
import { collection, getDocs, deleteDoc, addDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Player } from "@/types";
import { updateUserStats } from "@/lib/updateUserStats";

interface TournamentControlsProps {
  players: Player[];
  // Callback now accepts the snapshot of players (from before resetting) so that the summary can be shown.
  onTournamentEnd: (endedPlayers: Player[]) => void;
}

export default function TournamentControls({ players, onTournamentEnd }: TournamentControlsProps) {
  const [tournamentName, setTournamentName] = useState("Tournament");

  // End the tournament: save snapshot, update stats, reset game, then return the snapshot.
  const handleEndGame = async (e: FormEvent) => {
    e.preventDefault();
    if (!tournamentName.trim()) {
      alert("Please provide a tournament name before ending the game.");
      return;
    }

    // Ask for confirmation before ending the game.
    const confirmed = window.confirm(
      `Are you sure you want to end the tournament "${tournamentName}"? This will finalize the game, display the transaction summary, and reset the game.`
    );
    if (!confirmed) return;

    // Take a snapshot of the current players to be used for the summary.
    const endedPlayers = [...players];

    try {
      // Save the tournament snapshot in Firestore.
      await addDoc(collection(db, "tournaments"), {
        name: tournamentName.trim(),
        date: new Date().toISOString(),
        players: players || [],
      });

      // Update leaderboard stats for each player with a final result.
      for (const player of players) {
        if (player.finalCash !== null) {
          const net = player.finalCash - player.totalBuyIn;
          const won = net > 0;
          const userId = player.uid ?? player.id;
          await updateUserStats(userId, player.name, net, won);
        }
      }

      // Optionally reset the tournament name.
      setTournamentName("Tournament");

      // Now, reset the game by deleting all players from Firestore.
      const playersSnapshot = await getDocs(collection(db, "players"));
      const deletePromises = playersSnapshot.docs.map((docSnapshot) =>
        deleteDoc(doc(db, "players", docSnapshot.id))
      );
      await Promise.all(deletePromises);

      // Signal the parent with the snapshot taken before the deletion.
      onTournamentEnd(endedPlayers);
    } catch (error) {
      console.error("Error ending tournament:", error);
      alert("Failed to end tournament. Please try again.");
    }
  };

  // Reset tournament button deletes all players without showing a summary.
  const handleResetTournament = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset the tournament? This will remove all players."
    );
    if (!confirmed) return;

    try {
      const playersSnapshot = await getDocs(collection(db, "players"));
      const deletePromises = playersSnapshot.docs.map((docSnapshot) =>
        deleteDoc(doc(db, "players", docSnapshot.id))
      );
      await Promise.all(deletePromises);
      alert("Tournament reset successfully. All players have been removed.");
    } catch (error) {
      console.error("Error resetting tournament:", error);
      alert("Failed to reset tournament. Please try again.");
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
          <label htmlFor="tournamentName" className="mb-1">
            Tournament Name
          </label>
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
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition-colors"
        >
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