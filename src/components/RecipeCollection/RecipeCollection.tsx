import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Utensils } from "lucide-react";
import type { RecipeSummary } from "@/models/recipe";
import { CollectionRecipeCard } from "./CollectionRecipeCard";
import { getCollectionPagination, recipesPerPage } from "./pagination";
import styles from "./RecipeCollection.module.scss";

type CollectionLink = { label: string; href: string };

interface Props {
  name: string;
  eyebrow: string;
  description: string;
  recipes: RecipeSummary[];
  requestedPage?: string | string[];
  basePath: string;
  backLink: CollectionLink;
  relatedLinks: CollectionLink[];
  emptyDescription: string;
  emptyLinkLabel: string;
}

export const RecipeCollection = ({
  name,
  eyebrow,
  description,
  recipes,
  requestedPage,
  basePath,
  backLink,
  relatedLinks,
  emptyDescription,
  emptyLinkLabel,
}: Props) => {
  const { currentPage, pageCount, pageStart, paginationItems } =
    getCollectionPagination(recipes.length, requestedPage);
  const pageRecipes = recipes.slice(pageStart, pageStart + recipesPerPage);
  const heroRecipe = recipes[0];
  const heroDetail = recipes[1];
  const pageHref = (page: number) =>
    `${basePath}?page=${page}#recipe-collection`;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={`${styles.heroInner} site-container`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h1>{name} recipes</h1>
            <p className={styles.heroDescription}>{description}</p>
            <div className={styles.heroActions}>
              <span className={styles.recipeCount}>
                <Utensils aria-hidden="true" size={15} />
                {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
              </span>
              <Link className={styles.backLink} href={backLink.href}>
                <ArrowLeft aria-hidden="true" size={15} />
                {backLink.label}
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
                <p className={styles.eyebrow}>Explore {name}</p>
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
              {pageRecipes.map((recipe, index) => (
                <CollectionRecipeCard
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
                      aria-label="Previous page"
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
                      aria-label="Next page"
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

          {relatedLinks.length > 0 && (
            <section className={styles.discovery}>
              <div className={`${styles.discoveryInner} site-container`}>
                <p className={styles.eyebrow}>Keep discovering</p>
                <h2>What are you craving next?</h2>
                <p>
                  Move through Recipe Explorer’s collections and find a new
                  favorite for the table.
                </p>
                <div className={styles.discoveryLinks}>
                  {relatedLinks.map(({ label, href }) => (
                    <Link href={href} key={href}>
                      {label}
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
          <p>{emptyDescription}</p>
          <Link href={backLink.href}>{emptyLinkLabel}</Link>
        </section>
      )}
    </main>
  );
};
