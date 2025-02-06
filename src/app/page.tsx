"use client";

import { useEffect, useState } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PasscodeEntry from "@/components/PasscodeEntry";
import TabBar from "@/components/TabBar";
import AddPlayerForm from "@/components/AddPlayerForm";
import PlayerList from "@/components/PlayerList";
import TournamentControls from "@/components/TournamentControls";
import PastTournamentsList from "@/components/PastTournamentsList";
import EndGameSummary from "@/components/EndGameSummary";
import { Player } from "@/types";

export default function HomePage() {
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [activeTab, setActiveTab] = useState<"ledger" | "pastTournaments">("ledger");
  const [showEndGameSummary, setShowEndGameSummary] = useState(false);

  // Check for cached access in localStorage
  useEffect(() => {
    const stored = localStorage.getItem("accessGranted");
    if (stored === "true") {
      setHasAccess(true);
    }
  }, []);

  // Listen for real‑time updates from the "players" collection in Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "players"), (snapshot) => {
      const playersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Player[];
      setPlayers(playersData);
    });
    return () => unsubscribe();
  }, []);

  if (!hasAccess) {
    return <PasscodeEntry setHasAccess={setHasAccess} />;
  }

  return (
    <div>
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-4">
        {activeTab === "ledger" ? (
          <>
            <AddPlayerForm />
            <PlayerList players={players} />
            <TournamentControls players={players} />
            <button 
              onClick={() => setShowEndGameSummary(true)}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded transition-colors"
            >
              Show End Game Summary
            </button>
            {showEndGameSummary && (
              <EndGameSummary players={players} onClose={() => setShowEndGameSummary(false)} />
            )}
          </>
        ) : (
          <PastTournamentsList />
        )}
      </div>
    </div>
  );
}
