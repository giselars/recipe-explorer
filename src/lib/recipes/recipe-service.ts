import type { RecipeProvider } from "./recipe-provider";
import { createTheMealDbProvider } from "./providers/themealdb/themealdb-provider";

export const recipeService: RecipeProvider = createTheMealDbProvider();
