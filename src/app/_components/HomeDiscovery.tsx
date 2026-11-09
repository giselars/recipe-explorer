import type { CSSProperties } from "react";
import { HomeMotion } from "./HomeMotion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Recipe } from "@/models/recipe";
import { HomeRecipeCard } from "./HomeRecipeCard";
import { HeroVideo } from "./HeroVideo";
import styles from "./HomeDiscovery.module.scss";

const cuisineFlags: Record<string, string> = {
  Italian: "🇮🇹",
  Japanese: "🇯🇵",
  Mexican: "🇲🇽",
  Moroccan: "🇲🇦",
};

const ingredientDetails: Record<string, { image: string; note: string }> = {
  Chicken: {
    image: "/ingredients/chicken.png",
    note: "Roast, simmer, or stir-fry.",
  },
  Garlic: {
    image: "/ingredients/garlic.png",
    note: "A little clove. A lot of flavour.",
  },
  Mushrooms: {
    image: "/ingredients/mushrooms.png",
    note: "For risottos, soups, and golden toast.",
  },
  Lemon: {
    image: "/ingredients/lemon.png",
    note: "Zest, juice, and a bright finish.",
  },
};

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
              <p className={styles.eyebrow}>Cook with what you have</p>
              <h2 id="basics-title">
                What’s in your
                <br />
                <em>kitchen?</em>
              </h2>
              <p>
                A few cloves of garlic, a spare lemon, chicken for tonight.
                Choose an ingredient and see what you can make.
              </p>
              <Link className={styles.basicsBrowse} href="/categories">
                Explore all categories{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div>
              <p className={styles.selectionLabel} data-home-reveal="rise">
                On the kitchen counter
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
                      <span
                        className={styles.ingredientNumber}
                        aria-hidden="true"
                      >
                        0{index + 1}
                      </span>
                      {ingredientDetails[ingredient] && (
                        <Image
                          className={styles.ingredientImage}
                          src={ingredientDetails[ingredient].image}
                          alt=""
                          width={160}
                          height={160}
                          sizes="(min-width: 768px) 112px, 80px"
                        />
                      )}
                      <span className={styles.ingredientCopy}>
                        <span className={styles.ingredientName}>
                          {ingredient}
                        </span>
                        <span className={styles.ingredientNote}>
                          {ingredientDetails[ingredient]?.note ??
                            "Find recipes with this ingredient."}
                        </span>
                      </span>
                      <ArrowRight
                        className={styles.ingredientArrow}
                        size={20}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {recipes.length > 0 && (
        <section className={`${styles.recipeSection} site-container`}>
          <header className={styles.sectionHeading} data-home-reveal="rise">
            <div>
              <p className={styles.eyebrow}>Handpicked for you</p>
              <h2>Something worth cooking.</h2>
              <span>Four recipes to take to your table.</span>
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
                <HomeRecipeCard recipe={recipe} featured={index === 0} />
              </div>
            ))}
          </div>
        </section>
      )}

      {areas.length > 0 && (
        <section
          className={`${styles.editorialSection} ${styles.worldSection}`}
        >
          <div
            className={styles.worldMapReveal}
            data-home-reveal="map"
            aria-hidden="true"
          >
            <span className={styles.worldArtwork} />
          </div>
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
                        {cuisineFlags[area] && (
                          <span
                            className={styles.cuisineFlag}
                            aria-hidden="true"
                          >
                            {cuisineFlags[area]}
                          </span>
                        )}
                        <span>{area}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link className={styles.exploreAction} href="/cuisines">
                  Explore all cuisines
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </HomeMotion>
  );
};
