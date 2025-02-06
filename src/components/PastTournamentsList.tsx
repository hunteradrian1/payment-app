// /components/PastTournamentsList.tsx
"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Tournament, Player } from "@/types";

export default function PastTournamentsList() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tournaments"), (snapshot) => {
      const tournamentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Tournament[];
      setTournaments(tournamentData);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">Past Tournaments</h2>
      {tournaments.length === 0 ? (
        <p className="text-gray-400">No past tournaments available.</p>
      ) : (
        <ul className="space-y-6">
          {tournaments.map((tournament) => (
            <li key={tournament.id} className="border border-gray-600 p-4 rounded-lg bg-gray-800">
              <h3 className="text-xl font-semibold text-blue-400">{tournament.name}</h3>
              <p className="text-sm text-gray-400">
                Date: {new Date(tournament.date).toLocaleString()}
              </p>
              <details className="mt-2">
                <summary className="cursor-pointer text-blue-500 hover:underline">
                  View Details
                </summary>
                <table className="w-full table-auto mt-2 border-collapse">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Total Buy-In ($)</th>
                      <th className="border p-2">Final Cash ($)</th>
                      <th className="border p-2">Net ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(tournament.players ?? []).map((player: Player) => {
                      const net = player.finalCash !== null ? player.finalCash - player.totalBuyIn : 0;
                      return (
                        <tr key={player.id} className="hover:bg-gray-600 transition-colors">
                          <td className="border p-2">{player.name}</td>
                          <td className="border p-2">{player.totalBuyIn.toFixed(2)}</td>
                          <td className="border p-2">
                            {player.finalCash === null ? "Active" : player.finalCash.toFixed(2)}
                          </td>
                          <td className="border p-2">{player.finalCash === null ? "—" : net.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
