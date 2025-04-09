// src/app/layout.tsx
import "./globals.css";
import React from "react";
import AppHeader from "@/components/AppHeader";

export const metadata = {
  title: "Brown Wrestling Poker App",
  description: "Poker Tournaments Manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-800 text-gray-50">
        <header className="bg-gray-900 shadow p-4">
          <AppHeader />
        </header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}