// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { onSnapshot, collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import TabBar, { DashboardTab } from '@/components/TabBar';
import PlayerList from '@/components/PlayerList';
import TournamentControls from '@/components/TournamentControls';
import PastTournamentsList from '@/components/PastTournamentsList';
import EndGameSummary from '@/components/EndGameSummary';
import Leaderboard from '@/components/Leaderboard';
import { Player } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [activeTab, setActiveTab] = useState<DashboardTab>('ledger');
  // Instead of a simple Boolean, we store the snapshot from the ended game.
  const [endedPlayers, setEndedPlayers] = useState<Player[] | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const { user: currentUser, loading } = useAuth();

  // Ensure client-only rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect if not authenticated after loading completes
  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/');
    }
  }, [currentUser, loading, router]);

  // Real-time sync for players collection
  useEffect(() => {
    const unsubscribePlayers = onSnapshot(collection(db, 'players'), (snapshot) => {
      const playersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Player[];
      setPlayers(playersData);
    });
    return () => unsubscribePlayers();
  }, []);

  // Function to join the game using current authenticated user details
  const joinGame = async () => {
    if (!currentUser) return;
    try {
      await addDoc(collection(db, "players"), {
        uid: currentUser.uid,
        name: currentUser.displayName || currentUser.email,
        totalBuyIn: 0,
        finalCash: null,
      });
    } catch (error) {
      console.error("Error joining game:", error);
      alert("Failed to join game. Please try again.");
    }
  };

  // Check if the current user is already in the game
  const hasJoined = players.some((p) => p.uid === currentUser?.uid);

  if (!isClient) return null;
  if (loading) return <p className="text-center text-gray-300 mt-20">Loading dashboard...</p>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-8">
      {/* Tabs */}
      <section className="mb-8">
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </section>

      {/* Main Content */}
      <section className="space-y-8">
        {activeTab === 'ledger' && (
          <>
            {/* Join Game Card */}
            <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
              {!hasJoined ? (
                <>
                  <h2 className="text-2xl font-semibold mb-4">➕ Join Game</h2>
                  <p className="mb-4 text-gray-400">
                    Click below to join the current game and start tracking your performance.
                  </p>
                  <button
                    onClick={joinGame}
                    className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Join Game
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold mb-4">You are in the game</h2>
                  <p className="text-gray-400">
                    Your performance is being tracked. Check out the game tables below.
                  </p>
                </>
              )}
            </div>

            {/* Tables Card (previously Player Rankings) */}
            <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">Tables</h2>
              {players.length > 0 ? (
                <PlayerList players={players} />
              ) : (
                <p className="text-gray-400">No players have joined yet.</p>
              )}
            </div>

            {/* Tournament Controls Card */}
            <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">🎮 Tournament Controls</h2>
              <TournamentControls
                players={players}
                // Pass the snapshot from the End Game button handler.
                onTournamentEnd={(ended) => setEndedPlayers(ended)}
              />
              {endedPlayers && (
                <EndGameSummary
                  players={endedPlayers}
                  onClose={() => setEndedPlayers(null)}
                />
              )}
            </div>
          </>
        )}
        {activeTab === 'pastTournaments' && (
          // Past Tournaments Card
          <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">🕒 Past Tournaments</h2>
            <PastTournamentsList />
          </div>
        )}
        {activeTab === 'leaderboard' && (
          <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
            <Leaderboard />
          </div>
        )}
      </section>
    </main>
  );
}