import type { Metadata } from "next";
import { recipeService } from "@/lib/recipes/recipe-service";
import { CategoryBrowser } from "./_components";

export const metadata: Metadata = {
  title: "Explore categories",
  description: "Browse recipes by category and find your next meal.",
};

const CategoriesPage = async () => {
  const categories = await recipeService.getCategories();

  return <CategoryBrowser categories={categories} />;
};

export default CategoriesPage;
