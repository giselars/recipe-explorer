import type { Metadata } from "next";
import { recipeService } from "@/lib/recipes/recipe-service";
import { CuisineBrowser } from "./_components";

export const metadata: Metadata = {
  title: "Explore cuisines",
  description: "Discover recipes from cuisines around the world.",
};

const featuredCuisines = [
  { name: "Italian", recipeQuery: "Carbonara" },
  { name: "Japanese", recipeQuery: "Sushi" },
  { name: "Mexican", recipeQuery: "Chicken Enchilada" },
  { name: "French", recipeQuery: "French Onion Soup" },
  { name: "Indian", recipeQuery: "Chicken Handi" },
];

const CuisinesPage = async () => {
  const cuisines = await recipeService.getAreas();
  const availableNames = new Set(
    cuisines.map((cuisine) => cuisine.toLocaleLowerCase()),
  );
  const availableFeatured = featuredCuisines.filter(({ name }) =>
    availableNames.has(name.toLocaleLowerCase()),
  );
  const featuredResults = await Promise.allSettled(
    availableFeatured.map(async ({ name, recipeQuery }) => {
      const recipes = await recipeService.searchRecipes(recipeQuery);

      return { name, imageUrl: recipes[0]?.imageUrl ?? null };
    }),
  );
  const featured = featuredResults.map((result, index) =>
    result.status === "fulfilled"
      ? result.value
      : { name: availableFeatured[index].name, imageUrl: null },
  );

  return <CuisineBrowser cuisines={cuisines} featuredCuisines={featured} />;
};

export default CuisinesPage;
