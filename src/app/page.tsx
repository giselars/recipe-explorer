import type { Metadata } from "next";
import { recipeService } from "@/lib/recipes/recipe-service";
import { HomeDiscovery } from "./_components";

const featuredRecipeId = "52982";
const collectionRecipeIds = ["52844", "52772", "52874", "52940"];
const featuredIngredients = ["Chicken", "Garlic", "Mushrooms", "Lemon"];
const featuredAreas = ["Italian", "Japanese", "Mexican", "Moroccan"];

export const metadata: Metadata = {
  title: "Recipes for every table",
  description: "Discover thoughtful recipes, ingredients, and cuisines.",
};

const Home = async () => {
  const [
    featuredRecipe,
    collectionResults,
    availableIngredients,
    availableAreas,
  ] = await Promise.all([
    recipeService.getRecipeById(featuredRecipeId),
    Promise.all(
      collectionRecipeIds.map((recipeId) =>
        recipeService.getRecipeById(recipeId),
      ),
    ),
    recipeService.getIngredients().catch((): string[] => []),
    recipeService.getAreas().catch((): string[] => []),
  ]);

  const recipes = collectionResults.filter(
    (recipe): recipe is NonNullable<typeof recipe> => recipe !== null,
  );

  const ingredients = featuredIngredients.filter((ingredient) =>
    availableIngredients.includes(ingredient),
  );
  const areas = featuredAreas.filter((area) => availableAreas.includes(area));

  return (
    <HomeDiscovery
      featuredRecipe={featuredRecipe}
      recipes={recipes}
      ingredients={ingredients}
      areas={areas}
    />
  );
};

export default Home;
