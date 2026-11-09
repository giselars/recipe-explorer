import type { CSSProperties } from "react";
import { HomeMotion } from "./HomeMotion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Recipe } from "@/models/recipe";
import { HomeRecipeCard } from "./HomeRecipeCard";
import { HeroVideo } from "./HeroVideo";
import styles from "./HomeDiscovery.module.scss";

interface Props {
  featuredRecipe: Recipe | null;
  recipes: Recipe[];
  ingredients: string[];
  areas: string[];
}

export const HomeDiscovery = ({
  featuredRecipe,
  recipes,
  ingredients,
  areas,
}: Props) => {
  const hasIngredients = ingredients.length > 0;

  return (
    <HomeMotion className={styles.page}>
      <section
        className={`${styles.hero} ${hasIngredients ? styles.heroToGreen : styles.heroToIvory}`}
      >
        {featuredRecipe ? (
          <>
            <HeroVideo />
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
          className={styles.basicsSection}
          aria-labelledby="basics-title"
        >
          <div className={`${styles.basicsInner} site-container`}>
            <div className={styles.basicsIntro} data-home-reveal="rise">
              <p className={styles.eyebrow}>Ingredient spotlight</p>
              <h2 id="basics-title">
                Simple ingredients.
                <br />
                <em>Endless possibilities.</em>
              </h2>
              <p>
                Something delicious starts with what you have. Pick a kitchen
                staple and find your next favourite dish.
              </p>
              <Link className={styles.basicsBrowse} href="/categories">
                Explore all categories{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div>
              <p className={styles.selectionLabel} data-home-reveal="rise">
                A few good places to start
              </p>
              <ul
                className={styles.ingredientGrid}
                aria-label="Popular ingredients"
              >
                {ingredients.map((ingredient, index) => (
                  <li
                    key={ingredient}
                    data-home-reveal="rise"
                    style={
                      { "--home-delay": `${index * 90}ms` } as CSSProperties
                    }
                  >
                    <Link
                      href={`/ingredients/${encodeURIComponent(ingredient)}`}
                    >
                      <span className={styles.ingredientNumber}>
                        0{index + 1}
                      </span>
                      <span className={styles.ingredientName}>
                        {ingredient}
                      </span>
                      <span className={styles.ingredientCta}>
                        Find recipes <ArrowRight size={16} aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <p className={styles.kitchenNote} data-home-reveal="rise">
              <span>From the kitchen</span>
              Let good ingredients do the talking.
            </p>
          </div>
        </section>
      )}

      {recipes.length > 0 && (
        <section className={`${styles.recipeSection} site-container`}>
          <header className={styles.sectionHeading} data-home-reveal="rise">
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
            {recipes.map((recipe, index) => (
              <div
                key={recipe.id}
                className={styles.recipeEntry}
                data-home-reveal="rise"
                style={
                  { "--home-delay": `${(index + 1) * 80}ms` } as CSSProperties
                }
              >
                <HomeRecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        </section>
      )}

      {areas.length > 0 && (
        <section
          className={`${styles.editorialSection} ${styles.worldSection}`}
        >
          <div className={`${styles.editorialInner} site-container`}>
            <div className={styles.editorialContent} data-home-reveal="rise">
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

            <div
              className={styles.worldMapReveal}
              data-home-reveal="map"
              data-home-map
              aria-hidden="true"
            >
              <span className={styles.worldArtwork} />
            </div>
          </div>
        </section>
      )}
    </HomeMotion>
  );
};
