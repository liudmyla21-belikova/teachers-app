import css from "./Teachers.module.css";
import { useCallback, useEffect, useState } from "react";
import TeacherComponent from "../../components/Teacher/Teacher";
import type { Teacher } from "../../types/teacher";
import { fetchTeachers } from "../../services/teachers";
import Loader from "../../components/Loader/Loader";
import {
  addToFavorites,
  getFavorites,
  removeFromFavorites,
} from "../../services/favoriteTeachers";
import { useAuth } from "../../auth/useAuth";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

type Filters = { language: string; level: string; price: string };
const PAGE_SIZE = 4;

export default function Teachers() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<Filters>({
    language: "",
    level: "",
    price: "",
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const ids = await getFavorites(currentUser.uid);
          setFavoriteIds(new Set(ids));
        } catch (error) {
          console.error("Error loading favorites:", error);
        }
      } else {
        setFavoriteIds(new Set());
      }
    });
    return () => unsub();
  }, []);

  const loadTeachers = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const newTeachers = await fetchTeachers(lastKey);

      if (newTeachers.length < PAGE_SIZE) setHasMore(false);

      if (newTeachers.length > 0) {
        setLastKey(newTeachers[newTeachers.length - 1].id);
        setTeachers((prev) => {
          const existingIds = new Set(prev.map((t) => t.id));
          const uniqueNew = newTeachers.filter((t) => !existingIds.has(t.id));
          return [...prev, ...uniqueNew];
        });
      }
    } catch (error) {
      console.error("Error loading teachers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [lastKey, isLoading]);

  const toggleFavorite = async (teacherId: string) => {
    if (!user) {
      iziToast.info({
        title: "Info",
        message: "Please log in to add to favorites!",
        position: "topRight",
      });
      return;
    }

    const isFav = favoriteIds.has(teacherId);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isFav) next.delete(teacherId);
      else next.add(teacherId);
      return next;
    });

    try {
      if (isFav) await removeFromFavorites(user.uid, teacherId);
      else await addToFavorites(user.uid, teacherId);
    } catch {
      const ids = await getFavorites(user.uid);
      setFavoriteIds(new Set(ids));
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    if (filters.language && !t.languages.includes(filters.language))
      return false;
    if (filters.price && t.price_per_hour > Number(filters.price)) return false;
    if (filters.level && !t.levels.includes(filters.level)) return false;
    return true;
  });

  useEffect(() => {
    if (teachers.length === 0 && !isLoading) loadTeachers();
  }, [teachers.length, isLoading, loadTeachers]);

  useEffect(() => {
    if (
      !isLoading &&
      hasMore &&
      filteredTeachers.length === 0 &&
      teachers.length > 0
    ) {
      loadTeachers();
    }
  }, [
    filteredTeachers.length,
    teachers.length,
    hasMore,
    isLoading,
    loadTeachers,
  ]);

  return (
    <section className={css.teachers}>
      <div className={css.teachersContainer}>
        <div className={css.filtersBox}>
          <div className={css.languagesBox}>
            <label htmlFor="language">Languages</label>
            <select
              id="language"
              value={filters.language}
              onChange={(e) =>
                setFilters((p) => ({ ...p, language: e.target.value }))
              }
            >
              <option value="">All</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Mandarin Chinese">Mandarin Chinese</option>
            </select>
          </div>

          <div className={css.levelBox}>
            <label htmlFor="level">Level of knowledge</label>
            <select
              id="level"
              value={filters.level}
              onChange={(e) =>
                setFilters((p) => ({ ...p, level: e.target.value }))
              }
            >
              <option value="">All levels</option>
              <option value="A1 Beginner">A1 Beginner</option>
              <option value="A2 Elementary">A2 Elementary</option>
              <option value="B1 Intermediate">B1 Intermediate</option>
              <option value="B2 Upper-Intermediate">
                B2 Upper-Intermediate
              </option>
              <option value="C1 Advanced">C1 Advanced</option>
              <option value="C2 Proficient">C2 Proficient</option>
            </select>
          </div>

          <div className={css.priceBox}>
            <label htmlFor="price">Price</label>
            <select
              id="price"
              value={filters.price}
              onChange={(e) =>
                setFilters((p) => ({ ...p, price: e.target.value }))
              }
            >
              <option value="">All</option>
              <option value="20">20 $</option>
              <option value="25">25 $</option>
              <option value="30">30 $</option>
              <option value="40">40 $</option>
            </select>
          </div>
        </div>

        {filteredTeachers.length > 0 ? (
          <ul className={css.teachersList}>
            {filteredTeachers.map((teacher) => (
              <li key={teacher.id}>
                <TeacherComponent
                  teacher={teacher}
                  selectedLevel={filters.level}
                  isFavorite={favoriteIds.has(teacher.id)}
                  onToggleFavorite={() => toggleFavorite(teacher.id)}
                />
              </li>
            ))}
          </ul>
        ) : (
          !isLoading &&
          teachers.length > 0 && (
            <div className={css.notFoundWrapper}>
              <p className={css.notFoundText}>
                No teachers match your criteria. Please try adjusting your
                filters or load more profiles.
              </p>
            </div>
          )
        )}

        {isLoading && <Loader />}

        {hasMore && !isLoading && (
          <button type="button" onClick={loadTeachers} className={css.moreBtn}>
            Load more
          </button>
        )}
      </div>
    </section>
  );
}
