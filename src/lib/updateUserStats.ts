// src/lib/updateUserStats.ts
import { doc, setDoc, getDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Updates the userStats record for a player.
 * @param playerId - The user id (Firebase auth UID or player document id if UID not available).
 * @param displayName - The player’s display name.
 * @param net - The net amount for the tournament (finalCash - totalBuyIn).
 * @param won - Whether the tournament was won (net > 0).
 */
export async function updateUserStats(playerId: string, displayName: string, net: number, won: boolean) {
  const statsRef = doc(db, "userStats", playerId);
  const docSnap = await getDoc(statsRef);
  
  if (docSnap.exists()) {
    await setDoc(
      statsRef,
      {
        totalNet: increment(net),
        gamesPlayed: increment(1),
        tournamentsWon: won ? increment(1) : increment(0),
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
  } else {
    await setDoc(statsRef, {
      userId: playerId,
      displayName,
      totalNet: net,
      gamesPlayed: 1,
      tournamentsWon: won ? 1 : 0,
      lastUpdated: serverTimestamp(),
    });
  }
}