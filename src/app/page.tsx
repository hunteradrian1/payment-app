"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if user is signed in
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (user) return null;

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        alert(err.message);
      } else {
        console.error("An unexpected error occurred:", err);
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-50 p-4 sm:p-8">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 tracking-tight text-center">
        Brown Poker App
      </h1>
      <button
        onClick={handleGoogleSignIn}
        className="w-full sm:w-auto px-8 py-4 bg-red-500 hover:bg-red-600 transition-colors rounded-lg text-lg sm:text-xl shadow-lg"
      >
        Continue with Google
      </button>
    </main>
  );
}