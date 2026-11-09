import type { Metadata } from "next";
import Link from "next/link";
import { RecipeCard } from "@/components";
import { recipeService } from "@/lib/recipes/recipe-service";
import styles from "./page.module.scss";

interface Props {
  params: Promise<{ slug: string }>;
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

const IngredientRecipesPage = async ({ params }: Props) => {
  const ingredient = await getIngredient(params);
  const recipes = await recipeService.getRecipesByIngredient(ingredient);

  return (
    <main className={`${styles.page} site-container`}>
      <header className={styles.intro}>
        <p>Ingredient spotlight</p>
        <h1>{ingredient} recipes</h1>
        <span>Discover dishes that start with this kitchen staple.</span>
      </header>
      {recipes.length > 0 ? (
        <div className={styles.grid}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <h2>No recipes on the menu yet</h2>
          <p>Try another ingredient from our featured selection.</p>
          <Link href="/">Back to home</Link>
        </div>
      )}
    </main>
  );
};

export default IngredientRecipesPage;
