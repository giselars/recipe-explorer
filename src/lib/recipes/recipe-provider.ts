import type { Recipe, RecipeCategory, RecipeSummary } from "@/models/recipe";

export interface RecipeProvider {
  getRecipeById(id: string): Promise<Recipe | null>;
  getRecipesByIds(ids: string[]): Promise<RecipeSummary[]>;
  searchRecipes(query: string): Promise<RecipeSummary[]>;
  getCategories(): Promise<RecipeCategory[]>;
  getRecipesByCategory(category: string): Promise<RecipeSummary[]>;
  getAreas(): Promise<string[]>;
  getRecipesByArea(area: string): Promise<RecipeSummary[]>;
  getIngredients(): Promise<string[]>;
  getRecipesByIngredient(ingredient: string): Promise<RecipeSummary[]>;
  getRandomRecipe(): Promise<Recipe>;
}

export class RecipeProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RecipeProviderError";
  }
}
