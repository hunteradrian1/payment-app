// src/components/AppHeader.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";

export default function AppHeader() {
  const { user } = useAuth();

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