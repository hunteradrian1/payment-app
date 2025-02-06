// /components/AddPlayerForm.tsx
"use client";

import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AddPlayerForm() {
  const [name, setName] = useState("");
  const [buyIn, setBuyIn] = useState(10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Player name is required");
      return;
    }
    try {
      await addDoc(collection(db, "players"), {
        name: name.trim(),
        totalBuyIn: buyIn,
        finalCash: null,
      });
      setName("");
      setBuyIn(10);
    } catch (error) {
      console.error("Error adding player:", error);
      alert("Failed to add player. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6" aria-label="Add New Player">
      <fieldset className="border border-gray-600 p-4 rounded">
        <legend className="text-xl font-semibold mb-2">Add New Player</legend>
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex flex-col">
            <label htmlFor="playerName" className="mb-1">Player Name</label>
            <input
              id="playerName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 rounded text-gray-900"
              placeholder="Enter name"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="buyIn" className="mb-1">Initial Buy-In ($)</label>
            <input
              id="buyIn"
              type="number"
              value={buyIn}
              onChange={(e) => setBuyIn(Number(e.target.value))}
              className="px-3 py-2 rounded text-gray-900"
              min="0"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
          >
            Add Player
          </button>
        </div>
      </fieldset>
    </form>
  );
}
