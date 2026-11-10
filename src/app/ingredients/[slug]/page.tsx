import type { Metadata } from "next";
import { RecipeCollection } from "@/components/RecipeCollection/RecipeCollection";
import { featuredIngredients } from "@/lib/recipes/featured-ingredients";
import { recipeService } from "@/lib/recipes/recipe-service";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
}

const getIngredient = async (params: Props["params"]) => {
  const { slug } = await params;
  return decodeURIComponent(slug).trim();
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const ingredient = await getIngredient(params);

  return {
    title: `${ingredient} recipes`,
    description: `Explore recipes made with ${ingredient.toLocaleLowerCase()}.`,
  };
};

const IngredientRecipesPage = async ({ params, searchParams }: Props) => {
  const ingredient = await getIngredient(params);
  const [recipes, availableIngredients] = await Promise.all([
    recipeService.getRecipesByIngredient(ingredient),
    recipeService.getIngredients().catch((): string[] => []),
  ]);
  const relatedIngredients = featuredIngredients.filter(
    (name) =>
      name.toLocaleLowerCase() !== ingredient.toLocaleLowerCase() &&
      availableIngredients.some(
        (available) =>
          available.toLocaleLowerCase() === name.toLocaleLowerCase(),
      ),
  );

  return (
    <RecipeCollection
      name={ingredient}
      eyebrow="Ingredient spotlight"
      description="Discover dishes that start with this kitchen staple."
      recipes={recipes}
      requestedPage={(await searchParams).page}
      basePath={`/ingredients/${encodeURIComponent(ingredient)}`}
      backLink={{ label: "Explore ingredients", href: "/#ingredients" }}
      relatedLinks={relatedIngredients.map((name) => ({
        label: name,
        href: `/ingredients/${encodeURIComponent(name)}`,
      }))}
      emptyDescription="Try another ingredient from our featured selection."
      emptyLinkLabel="Explore ingredients"
    />
  );
};

export default IngredientRecipesPage;
