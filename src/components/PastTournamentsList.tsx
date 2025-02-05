// /components/PastTournamentsList.tsx
"use client";

import React from "react";
import { Tournament } from "@/types";

interface PastTournamentsListProps {
  tournaments: Tournament[];
}

export default function PastTournamentsList({
  tournaments,
}: PastTournamentsListProps) {
  return (
    <div>
      {tournaments.length === 0 ? (
        <p>No past tournaments available.</p>
      ) : (
        <ul className="space-y-4" aria-label="Past Tournaments List">
          {tournaments.map((tournament) => (
            <li key={tournament.id} className="border p-4 rounded">
              <h3 className="text-xl font-semibold">{tournament.name}</h3>
              <p className="text-sm text-gray-400">
                {new Date(tournament.date).toLocaleString()}
              </p>
              <details className="mt-2">
                <summary className="cursor-pointer">View Details</summary>
                <table className="w-full table-auto mt-2">
                  <thead>
                    <tr>
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Total Buy-In ($)</th>
                      <th className="border p-2">Final Cash ($)</th>
                      <th className="border p-2">Net ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tournament.players.map((player) => {
                      const net =
                        player.finalCash !== null
                          ? player.finalCash - player.totalBuyIn
                          : 0;
                      return (
                        <tr key={player.id}>
                          <td className="border p-2">{player.name}</td>
                          <td className="border p-2">
                            {player.totalBuyIn.toFixed(2)}
                          </td>
                          <td className="border p-2">
                            {player.finalCash === null
                              ? "Active"
                              : player.finalCash.toFixed(2)}
                          </td>
                          <td className="border p-2">
                            {player.finalCash === null
                              ? "—"
                              : net.toFixed(2)}
                          </td>
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