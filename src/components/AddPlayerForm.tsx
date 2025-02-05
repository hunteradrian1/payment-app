// /components/AddPlayerForm.tsx
"use client";

import React, { useState, FormEvent } from "react";
import { Player } from "@/types";

interface AddPlayerFormProps {
  players: Player[];
  updatePlayers: (players: Player[]) => void;
}

const DEFAULT_BUYIN = 10;

export default function AddPlayerForm({
  players,
  updatePlayers,
}: AddPlayerFormProps) {
  const [name, setName] = useState("");
  const [buyIn, setBuyIn] = useState<number>(DEFAULT_BUYIN);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Player name is required");
      return;
    }
    const newId =
      players.length > 0 ? Math.max(...players.map((p) => p.id)) + 1 : 1;
    const newPlayer: Player = {
      id: newId,
      name: name.trim(),
      totalBuyIn: buyIn,
      finalCash: null,
    };
    updatePlayers([...players, newPlayer]);
    setName("");
    setBuyIn(DEFAULT_BUYIN);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4" aria-label="Add New Player">
      <fieldset className="border border-gray-700 p-4 rounded">
        <legend className="text-xl font-semibold mb-2">Add New Player</legend>
        <div className="flex flex-col md:flex-row md:items-end gap-2">
          <div className="flex flex-col">
            <label htmlFor="playerName" className="mb-1">
              Player Name
            </label>
            <input
              id="playerName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-2 py-1 rounded text-gray-900"
              placeholder="Enter name"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="buyIn" className="mb-1">
              Initial Buy-In ($)
            </label>
            <input
              id="buyIn"
              type="number"
              value={buyIn}
              onChange={(e) => setBuyIn(Number(e.target.value))}
              className="px-2 py-1 rounded text-gray-900"
              min="0"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Add Player
          </button>
        </div>
      </fieldset>
    </form>
  );
}