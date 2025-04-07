'use client';

import { useEffect, useState } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { db, auth } from '@/lib/firebase';
import TabBar from '@/components/TabBar';
import AddPlayerForm from '@/components/AddPlayerForm';
import PlayerList from '@/components/PlayerList';
import TournamentControls from '@/components/TournamentControls';
import PastTournamentsList from '@/components/PastTournamentsList';
import EndGameSummary from '@/components/EndGameSummary';
import { Player } from '@/types';

export default function DashboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [activeTab, setActiveTab] = useState<'ledger' | 'pastTournaments'>('ledger');
  const [showEndGameSummary, setShowEndGameSummary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Ensure hydration-safe rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auth protection
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, [router]);

  // Firestore player sync
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

  if (!isClient) return null;
  if (loading) return <p className="text-center text-gray-300 mt-20">Loading dashboard...</p>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 border-b border-gray-700 pb-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            ♠️ Poker Tournament Dashboard
          </h1>
          <p className="text-gray-400 mt-1 text-lg">
            Manage your poker nights with style
          </p>
        </div>
        <button
          onClick={() => signOut(auth).then(() => router.push('/'))}
          className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Sign Out"
        >
          Sign Out
        </button>
      </header>

      {/* Tabs */}
      <section className="mb-8">
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </section>

      {/* Main Content */}
      <section className="space-y-8">
        {activeTab === 'ledger' ? (
          <>
            {/* Add Player Card */}
            <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">➕ Add Player</h2>
              <AddPlayerForm />
            </div>

            {/* Player Rankings Card */}
            <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">📋 Player Rankings</h2>
              {players.length > 0 ? (
                <PlayerList players={players} />
              ) : (
                <p className="text-gray-400">No players yet. Add some above!</p>
              )}
            </div>

            {/* Tournament Controls Card */}
            <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4">🎮 Tournament Controls</h2>
              <TournamentControls players={players} />
              <button
                onClick={() => setShowEndGameSummary(true)}
                className="mt-6 inline-block bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Show End Game Summary
              </button>
              {showEndGameSummary && (
                <EndGameSummary
                  players={players}
                  onClose={() => setShowEndGameSummary(false)}
                />
              )}
            </div>
          </>
        ) : (
          // Past Tournaments Card
          <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">🕒 Past Tournaments</h2>
            <PastTournamentsList />
          </div>
        )}
      </section>
    </main>
  );
}