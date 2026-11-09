import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Utensils } from "lucide-react";
import { recipeService } from "@/lib/recipes/recipe-service";
import { CategoryRecipeCard } from "./_components/CategoryRecipeCard";
import styles from "./page.module.scss";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};

const recipesPerPage = 5;

const getPaginationItems = (currentPage: number, pageCount: number) => {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "end-ellipsis", pageCount] as const;
  }

  if (currentPage >= pageCount - 2) {
    return [
      1,
      "start-ellipsis",
      pageCount - 2,
      pageCount - 1,
      pageCount,
    ] as const;
  }

  return [1, "start-ellipsis", currentPage, "end-ellipsis", pageCount] as const;
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
  const requestedPageValue = (await searchParams).page;
  const requestedPage = Number(
    Array.isArray(requestedPageValue)
      ? requestedPageValue[0]
      : requestedPageValue,
  );
  const pageCount = Math.max(1, Math.ceil(recipes.length / recipesPerPage));
  const currentPage = Number.isInteger(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), pageCount)
    : 1;
  const pageStart = (currentPage - 1) * recipesPerPage;
  const pageRecipes = recipes.slice(pageStart, pageStart + recipesPerPage);
  const featuredRecipes = pageRecipes.slice(0, 5);
  const remainingRecipes = pageRecipes.slice(5);
  const paginationItems = getPaginationItems(currentPage, pageCount);
  const heroRecipe = recipes[0];
  const heroDetail = recipes[1];
  const pageHref = (page: number) =>
    `/categories/${encodeURIComponent(category)}?page=${page}#recipe-collection`;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={`${styles.heroInner} site-container`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Category collection</p>
            <h1>{category} recipes</h1>
            <p className={styles.heroDescription}>
              Discover comforting favorites and fresh ideas selected from this
              Recipe Explorer collection.
            </p>
            <div className={styles.heroActions}>
              <span className={styles.recipeCount}>
                <Utensils aria-hidden="true" size={15} />
                {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
              </span>
              <Link className={styles.backLink} href="/categories">
                <ArrowLeft aria-hidden="true" size={15} />
                All categories
              </Link>
            </div>
          </div>

          {heroRecipe && (
            <div className={styles.heroCollage} aria-hidden="true">
              <span className={styles.butterAccent} />
              <span className={styles.terracottaAccent} />
              <span className={styles.heroMainImage}>
                <Image
                  src={heroRecipe.imageUrl}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 32rem, 80vw"
                />
              </span>
              {heroDetail && (
                <span className={styles.heroDetailImage}>
                  <Image
                    src={heroDetail.imageUrl}
                    alt=""
                    fill
                    priority
                    sizes="8rem"
                  />
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {recipes.length > 0 ? (
        <>
          <section
            className={`${styles.collection} site-container`}
            id="recipe-collection"
          >
            <header className={styles.collectionHeader}>
              <div>
                <p className={styles.eyebrow}>Explore {category}</p>
                <h2>A collection worth cooking</h2>
              </div>
              <div className={styles.resultsSummary}>
                <strong>
                  {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
                </strong>
                <span>
                  Page {currentPage} of {pageCount} · {recipesPerPage} per page
                </span>
              </div>
            </header>

            <div className={styles.mosaic}>
              {featuredRecipes.map((recipe, index) => (
                <CategoryRecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  variant={
                    index === 0
                      ? "featured"
                      : index === 1
                        ? "portrait"
                        : "standard"
                  }
                  priority={index < 2}
                  index={pageStart + index + 1}
                />
              ))}
            </div>

            {remainingRecipes.length > 0 && (
              <div className={styles.recipeGrid}>
                {remainingRecipes.map((recipe) => (
                  <CategoryRecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    variant="compact"
                  />
                ))}
              </div>
            )}

            {pageCount > 1 && (
              <nav className={styles.pagination} aria-label="Recipe pages">
                <span className={styles.paginationSummary}>
                  Page {currentPage} of {pageCount}
                </span>
                <div className={styles.paginationControls}>
                  {currentPage > 1 ? (
                    <Link
                      className={styles.paginationDirection}
                      href={pageHref(currentPage - 1)}
                    >
                      <ArrowLeft aria-hidden="true" size={14} />
                      <span>Previous</span>
                    </Link>
                  ) : (
                    <span
                      className={`${styles.paginationDirection} ${styles.disabled}`}
                      aria-disabled="true"
                    >
                      <ArrowLeft aria-hidden="true" size={14} />
                      <span>Previous</span>
                    </span>
                  )}

                  {paginationItems.map((item) =>
                    typeof item === "number" ? (
                      <Link
                        className={`${styles.paginationPage} ${item === currentPage ? styles.activePage : ""}`}
                        href={pageHref(item)}
                        aria-current={item === currentPage ? "page" : undefined}
                        key={item}
                      >
                        {item}
                      </Link>
                    ) : (
                      <span className={styles.paginationEllipsis} key={item}>
                        …
                      </span>
                    ),
                  )}

                  {currentPage < pageCount ? (
                    <Link
                      className={`${styles.paginationDirection} ${styles.nextPage}`}
                      href={pageHref(currentPage + 1)}
                    >
                      <span>Next</span>
                      <ArrowRight aria-hidden="true" size={14} />
                    </Link>
                  ) : (
                    <span
                      className={`${styles.paginationDirection} ${styles.disabled}`}
                      aria-disabled="true"
                    >
                      <span>Next</span>
                      <ArrowRight aria-hidden="true" size={14} />
                    </span>
                  )}
                </div>
              </nav>
            )}
          </section>

          {relatedCategories.length > 0 && (
            <section className={styles.discovery}>
              <div className={`${styles.discoveryInner} site-container`}>
                <p className={styles.eyebrow}>Keep discovering</p>
                <h2>What are you craving next?</h2>
                <p>
                  Move through Recipe Explorer’s collections and find a new
                  favorite for the table.
                </p>
                <div className={styles.categoryLinks}>
                  {relatedCategories.map(({ name }) => (
                    <Link
                      href={`/categories/${encodeURIComponent(name)}`}
                      key={name}
                    >
                      {name}
                      <ArrowUpRight aria-hidden="true" size={13} />
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        <section className={`${styles.empty} site-container`}>
          <h2>No recipes on the menu yet</h2>
          <p>Try another category to keep exploring.</p>
          <Link href="/categories">Browse categories</Link>
        </section>
      )}
    </main>
  );
};

export default CategoryRecipesPage;
