'use client';

import { auth, provider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        alert(err.message);
      } else {
        console.error('An unexpected error occurred:', err);
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-50 p-8">
      <h1 className="text-5xl font-bold mb-8 tracking-tight">Brown Poker App</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <button
          onClick={handleGoogleSignIn}
          className="px-8 py-4 bg-red-500 hover:bg-red-600 transition-colors rounded-lg text-white text-xl shadow-lg"
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}