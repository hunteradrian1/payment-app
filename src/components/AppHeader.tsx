"use client";

import { useAuth } from "@/hooks/useAuth";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function AppHeader() {
  const { user } = useAuth();
  const router = useRouter();

  // Do not display the header if there is no user
  if (!user) return null;

  return (
    <div className="container flex items-center justify-between py-4">
      <h1 className="text-2xl font-bold">♠️ Brown Wrestling Poker</h1>
      <span className="text-lg">
        Welcome, {user.displayName || user.email}
      </span>
      <button
        onClick={() => signOut(auth).then(() => router.push('/'))}
        className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Sign Out"
      >
        Sign Out
      </button>
    </div>
  );
}