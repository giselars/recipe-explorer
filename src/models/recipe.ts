export interface RecipeSummary {
  id: string;
  name: string;
  imageUrl: string;
  category: string | null;
}

export interface Ingredient {
  name: string;
  measure: string | null;
}

export interface Recipe extends RecipeSummary {
  area: string | null;
  instructions: string;
  ingredients: Ingredient[];
  tags: string[];
  sourceUrl: string | null;
  videoUrl: string | null;
}

export interface RecipeCategory {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
}
