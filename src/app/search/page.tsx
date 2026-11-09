import type { Metadata } from "next";
import { Search } from "lucide-react";
import { RecipeCard } from "@/components";
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
    <main className={`${styles.page} site-container`}>
      <header className={styles.intro}>
        <p>Find your next meal</p>
        <h1>Search recipes</h1>
        <span>Search TheMealDB&apos;s recipe collection by name.</span>
      </header>

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

      {query ? (
        <section className={styles.results} aria-labelledby="search-results">
          <header className={styles.resultsHeading}>
            <p>{recipes.length} recipes found</p>
            <h2 id="search-results">Results for &ldquo;{query}&rdquo;</h2>
          </header>
          {recipes.length > 0 ? (
            <div className={styles.grid}>
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <h2>No recipes found</h2>
              <p>Try a broader name or browse our recipe categories instead.</p>
            </div>
          )}
        </section>
      ) : (
        <section className={styles.initial} aria-labelledby="search-guidance">
          <h2 id="search-guidance">Start with a craving</h2>
          <p>
            Enter a recipe name to find dishes, then open any result for its
            ingredients and instructions.
          </p>
        </section>
      )}
    </main>
  );
};

export default SearchPage;
