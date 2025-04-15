"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UserStat {
  id: string;
  userId: string;
  displayName: string;
  totalNet: number;
  gamesPlayed: number;
  tournamentsWon: number;
  lastUpdated: Timestamp;
}

export default function Leaderboard() {
  const [userStats, setUserStats] = useState<UserStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const statsCollection = collection(db, "userStats");
    const q = query(statsCollection, orderBy("totalNet", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const stats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as UserStat[];
        setUserStats(stats);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching leaderboard:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-300 mt-20">Loading leaderboard...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-500 mt-20">
        Failed to load leaderboard. Please try again later.
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      {userStats.length === 0 ? (
        <p className="mt-4 text-gray-400">No leaderboard data available.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="border p-3">Rank</th>
              <th className="border p-3">Player</th>
              <th className="border p-3">Total Net</th>
              <th className="border p-3">Games Played</th>
              <th className="border p-3">Tournaments Won</th>
            </tr>
          </thead>
          <tbody>
            {userStats.map((stat, index) => (
              <tr key={stat.id} className="hover:bg-gray-700 transition-colors">
                <td className="border p-3 text-center">{index + 1}</td>
                <td className="border p-3">{stat.displayName}</td>
                <td className="border p-3 text-center">{Number(stat.totalNet).toFixed(2)}</td>
                <td className="border p-3 text-center">{stat.gamesPlayed}</td>
                <td className="border p-3 text-center">{stat.tournamentsWon}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}