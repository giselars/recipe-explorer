import type { Metadata } from "next";
import { Search } from "lucide-react";
import Link from "next/link";
import { CollectionRecipeCard } from "@/components/RecipeCollection/CollectionRecipeCard";
import { DiscoveryPage } from "@/components/DiscoveryPage/DiscoveryPage";
import shared from "@/components/DiscoveryPage/DiscoveryPage.module.scss";
import { recipeService } from "@/lib/recipes/recipe-service";
import styles from "./page.module.scss";

interface Props {
  searchParams: Promise<{ q?: string | string[] }>;
}

export const metadata: Metadata = {
  title: "Search recipes",
  description: "Search Recipe Explorer recipes by name.",
};

const getQuery = async (searchParams: Props["searchParams"]) => {
  const { q } = await searchParams;
  const value = Array.isArray(q) ? q[0] : q;

  return value?.trim().slice(0, 100) ?? "";
};

const SearchPage = async ({ searchParams }: Props) => {
  const query = await getQuery(searchParams);
  const recipes = query ? await recipeService.searchRecipes(query) : [];

  return (
    <DiscoveryPage
      eyebrow="Find your next meal"
      title="Search recipes"
      description="A familiar favorite or a new discovery. What are you craving?"
      controls={
        <form className={styles.form} action="/search" method="get">
          <label htmlFor="recipe-search">What would you like to cook?</label>
          <div className={styles.field}>
            <Search size={20} aria-hidden="true" />
            <input
              id="recipe-search"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="Try chicken, pasta, or curry"
              maxLength={100}
            />
            <button type="submit">Search</button>
          </div>
        </form>
      }
    >
      {query ? (
        <section aria-labelledby="search-results">
          <header className={shared.heading}>
            <h2 id="search-results">Results for &ldquo;{query}&rdquo;</h2>
            <p>
              {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}{" "}
              found
            </p>
          </header>
          {recipes.length > 0 ? (
            <div className={shared.grid}>
              {recipes.map((recipe) => (
                <CollectionRecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className={shared.empty}>
              <h3>No recipes found</h3>
              <p>Try a broader name or browse our recipe categories instead.</p>
              <Link href="/categories">Explore categories</Link>
            </div>
          )}
        </section>
      ) : (
        <section className={shared.empty} aria-labelledby="search-guidance">
          <h2 id="search-guidance">Start with a craving</h2>
          <p>
            Enter a recipe name to find dishes, then open any result for its
            ingredients and instructions.
          </p>
        </section>
      )}
    </DiscoveryPage>
  );
};

export default SearchPage;
