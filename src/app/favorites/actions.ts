"use server";

import type { RecipeSummary } from "@/models/recipe";
import { recipeService } from "@/lib/recipes/recipe-service";

const maxFavoriteRecipes = 100;

export const getFavoriteRecipes = async (
  ids: string[],
): Promise<RecipeSummary[]> => {
  const normalizedIds = Array.from(
    new Set(
      ids
        .slice(0, maxFavoriteRecipes)
        .map((id) => id.trim())
        .filter((id) => /^\d+$/.test(id)),
    ),
  );

  return recipeService.getRecipesByIds(normalizedIds);
};
