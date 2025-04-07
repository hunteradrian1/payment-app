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
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Brown Poker App</h1>
      <button
        onClick={handleGoogleSignIn}
        className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Continue with Google
      </button>
    </main>
  );
}