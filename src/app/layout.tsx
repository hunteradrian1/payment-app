// /app/layout.tsx
import "./globals.css";
import React from "react";

export const metadata = {
  title: "Brown Wrestling Poker App",
  description: "Poker Tournaments Manager",
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-800 text-gray-50">
        <header className="bg-gray-900 shadow p-4">
          <div className="container flex items-center justify-between">
            <h1 className="text-2xl font-bold">Poker Tournament Ledger</h1>
          </div>
        </header>
        <main className="container p-4">{children}</main>
      </body>
    </html>
  );
}
