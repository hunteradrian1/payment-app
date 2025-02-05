// /components/TournamentControls.tsx
"use client";

import React, { useState, FormEvent } from "react";
import { Player } from "@/types";

interface TournamentControlsProps {
  players: Player[];
  updatePlayers: (players: Player[]) => void;
  onEndGame: (tournamentName: string) => void;
  onReset: () => void;
}

export default function TournamentControls({
  players,
  updatePlayers,
  onEndGame,
  onReset,
}: TournamentControlsProps) {
  const [tournamentName, setTournamentName] = useState("");

  const handleEndGame = (e: FormEvent) => {
    e.preventDefault();
    if (!tournamentName.trim()) {
      alert("Please provide a tournament name before ending the game.");
      return;
    }
    onEndGame(tournamentName.trim());
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-end gap-4 mt-4">
      <form
        onSubmit={handleEndGame}
        className="flex flex-col md:flex-row items-end gap-2"
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
            className="px-2 py-1 rounded text-gray-900"
            placeholder="Enter tournament name"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          End Game
        </button>
      </form>
      <button
        onClick={onReset}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
        aria-label="Reset Tournament"
      >
        Reset Tournament
      </button>
    </div>
  );
}