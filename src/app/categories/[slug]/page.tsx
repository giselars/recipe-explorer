import type { Metadata } from "next";
import { recipeService } from "@/lib/recipes/recipe-service";
import { RecipeCollection } from "@/components/RecipeCollection/RecipeCollection";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};

const getCategory = async (params: CategoryPageProps["params"]) => {
  const { slug } = await params;
  return decodeURIComponent(slug).trim();
};

export const generateMetadata = async ({
  params,
}: CategoryPageProps): Promise<Metadata> => {
  const category = await getCategory(params);
  return {
    title: `${category} recipes`,
    description: `Explore ${category.toLocaleLowerCase()} recipes from Recipe Explorer.`,
  };
};

const CategoryRecipesPage = async ({
  params,
  searchParams,
}: CategoryPageProps) => {
  const category = await getCategory(params);
  const [recipes, categories] = await Promise.all([
    recipeService.getRecipesByCategory(category),
    recipeService.getCategories(),
  ]);
  const relatedCategories = categories
    .filter(
      ({ name }) => name.toLocaleLowerCase() !== category.toLocaleLowerCase(),
    )
    .slice(0, 5);
  return (
    <RecipeCollection
      name={category}
      eyebrow="Category collection"
      description="Discover comforting favorites and fresh ideas selected from this Recipe Explorer collection."
      recipes={recipes}
      requestedPage={(await searchParams).page}
      basePath={`/categories/${encodeURIComponent(category)}`}
      backLink={{ label: "All categories", href: "/categories" }}
      relatedLinks={relatedCategories.map(({ name }) => ({
        label: name,
        href: `/categories/${encodeURIComponent(name)}`,
      }))}
      emptyDescription="Try another category to keep exploring."
      emptyLinkLabel="Browse categories"
    />
  );
};

export default CategoryRecipesPage;
