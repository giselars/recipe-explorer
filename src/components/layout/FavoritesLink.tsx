"use client";

import { Bookmark } from "lucide-react";
import Link from "next/link";
import { useFavorites } from "@/features/favorites";
import styles from "./Header.module.scss";

export const FavoritesLink = () => {
  const { favoriteIds } = useFavorites();
  const count = favoriteIds.length;

  return (
    <Link
      className={styles.action}
      href="/favorites"
      aria-label={
        count === 1
          ? "View 1 favorite recipe"
          : `View ${count} favorite recipes`
      }
    >
      <Bookmark
        aria-hidden="true"
        fill={count > 0 ? "currentColor" : "none"}
        size={19}
        strokeWidth={1.8}
      />
      {count > 0 && <span className={styles.count}>{count}</span>}
    </Link>
  );
};
