"use client";

import Link from "next/link";
import { useEffect, useState, startTransition } from "react";
import { RecipeCard } from "@/components";
import { useFavorites } from "@/features/favorites";
import type { RecipeSummary } from "@/models/recipe";
import { getFavoriteRecipes } from "../actions";
import styles from "./FavoritesGrid.module.scss";

type FavoritesState =
  | { status: "loading" }
  | { status: "success"; recipes: RecipeSummary[] }
  | { status: "error" };

export const FavoritesGrid = () => {
  const { favoriteIds, isHydrated } = useFavorites();
  const [state, setState] = useState<FavoritesState>({ status: "loading" });

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    let isCurrent = true;

    startTransition(async () => {
      if (favoriteIds.length === 0) {
        if (isCurrent) {
          setState({ status: "success", recipes: [] });
        }
        return;
      }

      setState({ status: "loading" });

      try {
        const recipes = await getFavoriteRecipes(favoriteIds);

        if (isCurrent) {
          setState({ status: "success", recipes });
        }
      } catch {
        if (isCurrent) {
          setState({ status: "error" });
        }
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [favoriteIds, isHydrated]);

  if (state.status === "loading") {
    return (
      <div className={styles.status} aria-live="polite">
        <span className={styles.spinner} aria-hidden="true" />
        <p>Gathering your saved recipes...</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className={styles.empty} role="alert">
        <h2>We couldn&apos;t load your favorites</h2>
        <p>Please refresh the page and try again.</p>
      </div>
    );
  }

  if (state.recipes.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>Your recipe box is empty</h2>
        <p>
          Save recipes as you browse and they&apos;ll be waiting for you here.
        </p>
        <Link href="/categories">Explore categories</Link>
      </div>
    );
  }

  return (
    <section aria-labelledby="saved-recipes-title">
      <header className={styles.heading}>
        <h2 id="saved-recipes-title">Saved recipes</h2>
        <span>
          {state.recipes.length}{" "}
          {state.recipes.length === 1 ? "recipe" : "recipes"}
        </span>
      </header>
      <div className={styles.grid}>
        {state.recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
};
