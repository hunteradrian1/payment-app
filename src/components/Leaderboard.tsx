// src/components/Leaderboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UserStat {
  id: string;
  userId: string;
  displayName: string;
  totalNet: number;
  gamesPlayed: number;
  tournamentsWon: number;
  lastUpdated: any;
}

export default function Leaderboard() {
  const [userStats, setUserStats] = useState<UserStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const statsCollection = collection(db, 'userStats');
    // Order by highest totalNet descending
    const q = query(statsCollection, orderBy('totalNet', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const stats: UserStat[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserStat[];
      setUserStats(stats);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-300 mt-20">Loading leaderboard...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
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
              <td className="border p-3 text-center">{stat.totalNet.toFixed(2)}</td>
              <td className="border p-3 text-center">{stat.gamesPlayed}</td>
              <td className="border p-3 text-center">{stat.tournamentsWon}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}