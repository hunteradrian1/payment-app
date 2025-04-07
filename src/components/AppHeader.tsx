"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

export default function AppHeader() {
  const [user, setUser] = useState<null | { displayName: string | null; email: string | null }>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName,
          email: currentUser.email,
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="container flex items-center justify-between">
      <h1 className="text-2xl font-bold">Poker Tournament Ledger</h1>
      {user && (
        <span className="text-lg">
          Welcome, {user.displayName || user.email}
        </span>
      )}
    </div>
  );
}