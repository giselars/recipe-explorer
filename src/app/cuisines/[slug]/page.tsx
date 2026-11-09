import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Globe,
  MapPin,
  Utensils,
} from "lucide-react";
import { FavoriteButton } from "@/components";
import { recipeService } from "@/lib/recipes/recipe-service";
import { CuisineRecipeCard } from "./_components/CuisineRecipeCard";
import styles from "./page.module.scss";

interface Props {
  params: Promise<{ slug: string }>;
}

const countryNames: Record<string, string> = {
  American: "the United States",
  British: "the United Kingdom",
  Canadian: "Canada",
  Chinese: "China",
  Croatian: "Croatia",
  Dutch: "the Netherlands",
  Egyptian: "Egypt",
  Filipino: "the Philippines",
  French: "France",
  Greek: "Greece",
  Indian: "India",
  Irish: "Ireland",
  Italian: "Italy",
  Jamaican: "Jamaica",
  Japanese: "Japan",
  Kenyan: "Kenya",
  Malaysian: "Malaysia",
  Mexican: "Mexico",
  Moroccan: "Morocco",
  Norwegian: "Norway",
  Polish: "Poland",
  Portuguese: "Portugal",
  Russian: "Russia",
  Spanish: "Spain",
  Thai: "Thailand",
  Tunisian: "Tunisia",
  Turkish: "Türkiye",
  Ukrainian: "Ukraine",
  Uruguayan: "Uruguay",
  Vietnamese: "Vietnam",
};

const getCuisine = async (params: Props["params"]) => {
  const { slug } = await params;
  return decodeURIComponent(slug).trim();
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const cuisine = await getCuisine(params);

  return {
    title: `${cuisine} recipes`,
    description: `Explore recipes from the ${cuisine} cuisine collection.`,
  };
};

const CuisineRecipesPage = async ({ params }: Props) => {
  const cuisine = await getCuisine(params);
  const recipes = await recipeService.getRecipesByArea(cuisine);
  const country = countryNames[cuisine] ?? cuisine;
  const featuredRecipe = recipes[0];
  const remainingRecipes = recipes.slice(1);
  const heroDetailOne = recipes[5] ?? recipes[2];
  const heroDetailTwo = recipes[1];
  const facts = [
    { icon: MapPin, label: "Cuisine", value: cuisine },
    {
      icon: Utensils,
      label: "Collection",
      value: `${recipes.length} ${recipes.length === 1 ? "recipe" : "recipes"}`,
    },
    { icon: Globe, label: "From the atlas", value: "Global table" },
  ];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={`${styles.heroInner} site-container`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              Global cuisine / {String(recipes.length).padStart(2, "0")} recipes
            </p>
            <h1>A taste of {country}</h1>
            <p className={styles.heroDescription}>
              Explore recipes from this culinary collection and bring a new
              favorite to your table.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.exploreLink} href="#cuisine-recipes">
                Explore recipes <ArrowDown aria-hidden="true" size={15} />
              </a>
              <Link className={styles.backLink} href="/cuisines">
                <ArrowLeft aria-hidden="true" size={15} />
                All cuisines
              </Link>
            </div>
          </div>

          {featuredRecipe && (
            <div className={styles.heroCollage} aria-hidden="true">
              <span className={styles.heroMainImage}>
                <Image
                  src={featuredRecipe.imageUrl}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 23rem, (min-width: 640px) 24rem, 64vw"
                />
              </span>
              {heroDetailOne && (
                <span className={styles.heroDetailOne}>
                  <Image
                    src={heroDetailOne.imageUrl}
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 640px) 13rem, 34vw"
                  />
                </span>
              )}
              {heroDetailTwo && (
                <span className={styles.heroDetailTwo}>
                  <Image
                    src={heroDetailTwo.imageUrl}
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 640px) 13rem, 34vw"
                  />
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      <section className={styles.facts} aria-label="Cuisine overview">
        <div className={`${styles.factsInner} site-container`}>
          {facts.map(({ icon: Icon, label, value }) => (
            <div className={styles.fact} key={label}>
              <span className={styles.factIcon}>
                <Icon aria-hidden="true" size={18} />
              </span>
              <span>
                <small>{label}</small>
                <strong>{value}</strong>
              </span>
            </div>
          ))}
        </div>
      </section>

      {featuredRecipe ? (
        <section
          className={`${styles.journey} site-container`}
          id="cuisine-recipes"
        >
          <header className={styles.journeyHeader}>
            <div>
              <p className={styles.eyebrow}>Begin with a classic</p>
              <h2>Your first stop at the table</h2>
            </div>
            <span>
              {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"} in
              this collection
            </span>
          </header>

          <article className={styles.featuredRecipe}>
            <Link
              className={styles.featuredImage}
              href={`/recipes/${featuredRecipe.id}`}
            >
              <Image
                src={featuredRecipe.imageUrl}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 46rem, 100vw"
              />
            </Link>
            <div className={styles.featuredCopy}>
              <span>Start here</span>
              <h3>{featuredRecipe.name}</h3>
              <p>
                An inviting place to begin exploring this culinary collection.
              </p>
              <Link href={`/recipes/${featuredRecipe.id}`}>
                View recipe <ArrowUpRight aria-hidden="true" size={14} />
              </Link>
            </div>
            <span className={styles.featuredSave}>
              <FavoriteButton
                recipeId={featuredRecipe.id}
                recipeName={featuredRecipe.name}
                variant="overlay"
              />
            </span>
          </article>

          {remainingRecipes.length > 0 && (
            <>
              <header className={styles.moreHeader}>
                <div>
                  <p className={styles.eyebrow}>
                    More from the {cuisine} table
                  </p>
                  <h2>Continue the journey</h2>
                </div>
                <span>
                  {remainingRecipes.length} more{" "}
                  {remainingRecipes.length === 1 ? "recipe" : "recipes"}
                </span>
              </header>
              <div className={styles.recipeGrid}>
                {remainingRecipes.map((recipe, index) => (
                  <CuisineRecipeCard
                    recipe={recipe}
                    index={index + 2}
                    key={recipe.id}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      ) : (
        <section className={`${styles.empty} site-container`}>
          <h2>No recipes on the menu yet</h2>
          <p>Try another cuisine to keep exploring.</p>
          <Link href="/cuisines">Browse cuisines</Link>
        </section>
      )}

      <section className={styles.atlasBand}>
        <div className={`${styles.atlasInner} site-container`}>
          <div>
            <p className={styles.eyebrow}>The journey continues</p>
            <h2>Travel through flavor</h2>
            <p>
              Return to the world atlas and discover another table, tradition,
              and collection.
            </p>
            <Link href="/cuisines">
              Browse all cuisines <ArrowRight aria-hidden="true" size={14} />
            </Link>
          </div>
          <span className={styles.atlasMap} aria-hidden="true" />
        </div>
      </section>
    </main>
  );
};

export default CuisineRecipesPage;
