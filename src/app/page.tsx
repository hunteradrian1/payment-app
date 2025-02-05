// /app/page.tsx
"use client";

import { useState, useEffect } from "react";
import TabBar from "@/components/TabBar";
import AddPlayerForm from "@/components/AddPlayerForm";
import PlayerList from "@/components/PlayerList";
import TournamentControls from "@/components/TournamentControls";
import EndGameSummary from "@/components/EndGameSummary";
import PastTournamentsList from "@/components/PastTournamentsList";
import { Player, Tournament } from "@/types";

const LOCAL_STORAGE_PLAYERS_KEY = "currentTournamentPlayers";
const LOCAL_STORAGE_PAST_KEY = "pastTournaments";

const defaultPlayers: Player[] = [
  { id: 1, name: "Alice", totalBuyIn: 10, finalCash: null },
  { id: 2, name: "Bob", totalBuyIn: 10, finalCash: null },
  { id: 3, name: "Charlie", totalBuyIn: 10, finalCash: null },
];

export default function HomePage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [pastTournaments, setPastTournaments] = useState<Tournament[]>([]);
  const [activeTab, setActiveTab] = useState<"current" | "past">("current");
  const [showEndGameSummary, setShowEndGameSummary] = useState(false);

  // Load current tournament players from localStorage.
  useEffect(() => {
    const storedPlayers = localStorage.getItem(LOCAL_STORAGE_PLAYERS_KEY);
    if (storedPlayers) {
      setPlayers(JSON.parse(storedPlayers));
    } else {
      setPlayers(defaultPlayers);
    }
  }, []);

  // Save current tournament players to localStorage when changed.
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PLAYERS_KEY, JSON.stringify(players));
  }, [players]);

  // Load past tournaments from localStorage.
  useEffect(() => {
    const storedTournaments = localStorage.getItem(LOCAL_STORAGE_PAST_KEY);
    if (storedTournaments) {
      setPastTournaments(JSON.parse(storedTournaments));
    }
  }, []);

  // Save past tournaments when changed.
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PAST_KEY, JSON.stringify(pastTournaments));
  }, [pastTournaments]);

  // When ending the game, store the tournament in pastTournaments and show the summary.
  const handleEndGame = (tournamentName: string) => {
    const newTournament: Tournament = {
      id: Date.now(),
      name: tournamentName,
      date: new Date().toISOString(),
      players: players,
      debts: [],
    };
    setPastTournaments([newTournament, ...pastTournaments]);
    setShowEndGameSummary(true);
  };

  // Reset the current tournament (clearing final cash values).
  const handleResetTournament = () => {
    if (
      confirm(
        "Are you sure you want to reset the tournament? This will clear final cash and start a new game."
      )
    ) {
      const resetPlayers = players.map((player) => ({
        ...player,
        finalCash: null,
      }));
      setPlayers(resetPlayers);
      setShowEndGameSummary(false);
    }
  };

  // Update players from child components.
  const updatePlayers = (updatedPlayers: Player[]) => {
    setPlayers(updatedPlayers);
  };

  return (
    <main className="p-4">
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "current" ? (
        <section aria-label="Current Tournament Ledger">
          <h1 className="text-3xl font-bold mb-4">
            Current Tournament Ledger
          </h1>
          <AddPlayerForm players={players} updatePlayers={updatePlayers} />
          <PlayerList players={players} updatePlayers={updatePlayers} />
          <TournamentControls
            players={players}
            updatePlayers={updatePlayers}
            onEndGame={handleEndGame}
            onReset={handleResetTournament}
          />
          {showEndGameSummary && (
            <EndGameSummary
              players={players}
              onClose={() => setShowEndGameSummary(false)}
            />
          )}
        </section>
      ) : (
        <section aria-label="Past Tournaments">
          <h1 className="text-3xl font-bold mb-4">Past Tournaments</h1>
          <PastTournamentsList tournaments={pastTournaments} />
        </section>
      )}
    </main>
  );
}