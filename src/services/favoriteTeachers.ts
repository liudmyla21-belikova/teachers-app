import { ref, set, remove, get } from "firebase/database";
import { db } from "../firebase/firebaseConfig";

const getFavPath = (uid: string, teacherId?: string) => 
  `users/${uid}/favorites${teacherId ? `/${teacherId}` : ""}`;

export const addToFavorites = (uid: string, teacherId: string) => {
  return set(ref(db, getFavPath(uid, teacherId)), true);
};

export const removeFromFavorites = (uid: string, teacherId: string) => {
  return remove(ref(db, getFavPath(uid, teacherId)));
};

export const getFavorites = async (uid: string): Promise<string[]> => {
  const snapshot = await get(ref(db, getFavPath(uid)));
  if (!snapshot.exists()) return [];
  return Object.keys(snapshot.val());
};