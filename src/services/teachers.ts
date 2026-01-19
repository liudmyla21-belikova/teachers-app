import {
  ref,
  query,
  orderByKey,
  startAfter,
  limitToFirst,
  get,
} from "firebase/database";
import { db } from "../firebase/firebaseConfig";
import type { Teacher } from "../types/teacher";

const PAGE_SIZE = 4;

type TeacherFromDB = Omit<Teacher, "id">;

export async function fetchTeachers(
  lastKey: string | null
): Promise<Teacher[]> {
  const teachersRef = ref(db, "teachers");

  const q = lastKey
    ? query(
        teachersRef,
        orderByKey(),
        startAfter(lastKey),
        limitToFirst(PAGE_SIZE)
      )
    : query(teachersRef, orderByKey(), limitToFirst(PAGE_SIZE));

  const snapshot = await get(q);

  if (!snapshot.exists()) return [];

  const data = snapshot.val() as Record<string, TeacherFromDB>;

  return Object.entries(data).map(([id, value]) => ({
    id,
    ...value,
  }));
}
export const getAllTeachers = async (): Promise<Teacher[]> => {
  const snapshot = await get(ref(db, "teachers"));
  
  if (!snapshot.exists()) return [];
  
  const data = snapshot.val() as Record<string, TeacherFromDB>;
  
  return Object.entries(data).map(([id, value]) => ({
    id,
    ...value,
  }));
};