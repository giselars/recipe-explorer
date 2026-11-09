"use client";

import { Bookmark } from "lucide-react";
import { useFavorites } from "@/features/favorites";
import styles from "./FavoriteButton.module.scss";

interface Props {
  recipeId: string;
  recipeName: string;
  variant?: "default" | "overlay";
}

export const FavoriteButton = ({
  recipeId,
  recipeName,
  variant = "default",
}: Props) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isSaved = isFavorite(recipeId);
  const label = isSaved
    ? `Remove ${recipeName} from favorites`
    : `Save ${recipeName} to favorites`;

  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      type="button"
      aria-label={label}
      aria-pressed={isSaved}
      title={label}
      onClick={() => toggleFavorite(recipeId)}
    >
      <Bookmark
        aria-hidden="true"
        fill={isSaved ? "currentColor" : "none"}
        size={18}
        strokeWidth={1.8}
      />
      {variant === "default" && (
        <span>{isSaved ? "Saved" : "Save recipe"}</span>
      )}
    </button>
  );
};
