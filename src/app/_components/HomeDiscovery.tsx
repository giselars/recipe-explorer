import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Recipe, RecipeSummary } from "@/models/recipe";
import { HomeRecipeCard } from "./HomeRecipeCard";
import styles from "./HomeDiscovery.module.scss";

interface Props {
  featuredRecipe: Recipe | null;
  recipes: Recipe[];
  ingredients: string[];
  areas: string[];
  worldRecipes: RecipeSummary[];
}

export const HomeDiscovery = ({
  featuredRecipe,
  recipes,
  ingredients,
  areas,
  worldRecipes,
}: Props) => {
  const hasIngredients = ingredients.length > 0;
  const ingredientPhotoRecipes = recipes.slice(0, 3);

  return (
    <main className={styles.page}>
      <section
        className={`${styles.hero} ${hasIngredients ? styles.heroToGreen : styles.heroToIvory}`}
      >
        {featuredRecipe ? (
          <>
            <Image
              className={styles.heroImage}
              src={featuredRecipe.imageUrl}
              alt={featuredRecipe.name}
              fill
              priority
              sizes="100vw"
            />
            <div className={styles.heroOverlay} />
            <div className={`${styles.heroInner} site-container`}>
              <div className={styles.heroContent}>
                <p className={styles.kicker}>Classic pasta</p>
                <h1>{featuredRecipe.name}</h1>
                <p className={styles.heroDescription}>
                  A recipe worth gathering around, with every ingredient and
                  instruction ready when you are.
                </p>
                <Link
                  className={styles.primaryAction}
                  href={`/recipes/${featuredRecipe.id}`}
                >
                  View recipe <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className={`${styles.heroFallback} site-container`}>
            <p className={styles.kicker}>Recipe Explorer kitchen</p>
            <h1>Recipes for every table.</h1>
            <p>Discover a considered collection of dishes to cook at home.</p>
            <Link className={styles.primaryAction} href="/categories">
              Explore categories <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        )}
      </section>

      {hasIngredients && (
        <section
          className={`${styles.editorialSection} ${styles.basicsSection}`}
        >
          <div className={`${styles.editorialInner} site-container`}>
            <div className={styles.editorialContent}>
              <div className={styles.editorialCopy}>
                <p className={styles.eyebrow}>Ingredient spotlight</p>
                <h2>Start with the basics</h2>
                <p>
                  Familiar ingredients are a simple place to begin your next
                  recipe.
                </p>
              </div>
              <div className={styles.editorialActions}>
                <ul
                  className={styles.chipList}
                  aria-label="Popular ingredients"
                >
                  {ingredients.map((ingredient) => (
                    <li key={ingredient}>
                      <Link
                        href={`/ingredients/${encodeURIComponent(ingredient)}`}
                      >
                        {ingredient}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link className={styles.exploreAction} href="/categories">
                  Explore the basics
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className={styles.photoCluster}>
              {ingredientPhotoRecipes[0] && (
                <span className={`${styles.photo} ${styles.ingredientMain}`}>
                  <Image
                    src={ingredientPhotoRecipes[0].imageUrl}
                    alt={ingredientPhotoRecipes[0].name}
                    fill
                    sizes="16rem"
                  />
                </span>
              )}
              {ingredientPhotoRecipes[1] && (
                <span className={`${styles.photo} ${styles.ingredientHerbs}`}>
                  <Image
                    src={ingredientPhotoRecipes[1].imageUrl}
                    alt={ingredientPhotoRecipes[1].name}
                    fill
                    sizes="6rem"
                  />
                </span>
              )}
              {ingredientPhotoRecipes[2] && (
                <span className={`${styles.photo} ${styles.ingredientLemons}`}>
                  <Image
                    src={ingredientPhotoRecipes[2].imageUrl}
                    alt={ingredientPhotoRecipes[2].name}
                    fill
                    sizes="5rem"
                  />
                </span>
              )}
            </div>

            <div className={styles.chefComposition}>
              <div className={styles.chalkboard}>
                <Image src="/home/chalkboard.jpg" alt="" fill sizes="14rem" />
                <div className={styles.chalkboardCopy}>
                  <strong>Chef&apos;s note</strong>
                  <p>
                    Salt in layers, taste as you go, and let simple ingredients
                    do the work.
                  </p>
                  <span>— Chef Marta</span>
                </div>
              </div>
              <span className={styles.ingredientArtwork} aria-hidden="true" />
            </div>
          </div>
        </section>
      )}

      {recipes.length > 0 && (
        <section className={`${styles.recipeSection} site-container`}>
          <header className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Handpicked for you</p>
              <h2>Discover recipes</h2>
              <span>A small editorial selection from TheMealDB.</span>
            </div>
            <Link className={styles.textLink} href="/categories">
              Browse categories <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </header>
          <div className={styles.recipeGrid}>
            {recipes.map((recipe) => (
              <HomeRecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}

      {areas.length > 0 && (
        <section
          className={`${styles.editorialSection} ${styles.worldSection}`}
        >
          <div className={`${styles.editorialInner} site-container`}>
            <div className={styles.editorialContent}>
              <div className={styles.editorialCopy}>
                <p className={styles.eyebrow}>Explore cuisines</p>
                <h2>Cook around the world</h2>
                <p>
                  Browse a changing collection of recipes from these cuisines.
                </p>
              </div>
              <div className={styles.editorialActions}>
                <ul className={styles.chipList} aria-label="Featured cuisines">
                  {areas.map((area) => (
                    <li key={area}>
                      <Link href={`/cuisines/${encodeURIComponent(area)}`}>
                        {area}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link className={styles.exploreAction} href="/cuisines">
                  Explore all cuisines
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className={styles.photoCluster}>
              {worldRecipes[0] && (
                <span className={`${styles.photo} ${styles.worldMain}`}>
                  <Image
                    src={worldRecipes[0].imageUrl}
                    alt={worldRecipes[0].name}
                    fill
                    sizes="15rem"
                  />
                </span>
              )}
              {worldRecipes[1] && (
                <span className={`${styles.photo} ${styles.worldJapanese}`}>
                  <Image
                    src={worldRecipes[1].imageUrl}
                    alt={worldRecipes[1].name}
                    fill
                    sizes="6rem"
                  />
                </span>
              )}
              {worldRecipes[2] && (
                <span className={`${styles.photo} ${styles.worldMexican}`}>
                  <Image
                    src={worldRecipes[2].imageUrl}
                    alt={worldRecipes[2].name}
                    fill
                    sizes="5rem"
                  />
                </span>
              )}
            </div>

            <span className={styles.worldArtwork} aria-hidden="true" />
          </div>
        </section>
      )}
    </main>
  );
};
