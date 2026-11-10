import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ListOrdered,
  Leaf,
  MapPin,
  ShoppingBasket,
  Utensils,
} from "lucide-react";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components";
import { recipeService } from "@/lib/recipes/recipe-service";
import styles from "./page.module.scss";

interface Props {
  params: Promise<{ id: string }>;
}

const getRecipe = async (params: Props["params"]) => {
  const { id } = await params;
  return recipeService.getRecipeById(id);
};

const getPreparationSteps = (instructions: string) => {
  const markedSteps = instructions
    .replaceAll("\r", "")
    .split(/(?:^|\n)\s*STEP\s+\d+\s*(?:[:.)-]\s*)?/i)
    .map((step) => step.trim())
    .filter(Boolean);

  if (markedSteps.length > 1) {
    return markedSteps;
  }

  return instructions
    .split(/\r?\n+/)
    .map((step) => step.trim())
    .filter((step) => step && !/^STEP\s+\d+\s*$/i.test(step));
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const recipe = await getRecipe(params);
  return recipe
    ? {
        title: recipe.name,
        description: `Ingredients and instructions for ${recipe.name}.`,
      }
    : { title: "Recipe not found" };
};

const RecipePage = async ({ params }: Props) => {
  const recipe = await getRecipe(params);

  if (!recipe) {
    notFound();
  }

  const steps = getPreparationSteps(recipe.instructions);
  const facts = [
    recipe.area ? { icon: MapPin, label: "Origin", value: recipe.area } : null,
    recipe.category
      ? { icon: Utensils, label: "Category", value: recipe.category }
      : null,
    {
      icon: ShoppingBasket,
      label: "Ingredients",
      value: `${recipe.ingredients.length} items`,
    },
    {
      icon: ListOrdered,
      label: "Method",
      value: `${steps.length} ${steps.length === 1 ? "step" : "steps"}`,
    },
  ].filter((fact) => fact !== null);

  return (
    <article className={styles.page}>
      <section className={styles.hero}>
        <div className={`${styles.heroInner} site-container`}>
          <div className={styles.summary}>
            <div className={styles.recipeMeta}>
              <span className={styles.eyebrow}>Recipes</span>
              {recipe.category && (
                <Link
                  href={`/categories/${encodeURIComponent(recipe.category)}`}
                >
                  {recipe.category}
                </Link>
              )}
              {recipe.area && (
                <Link href={`/cuisines/${encodeURIComponent(recipe.area)}`}>
                  {recipe.area}
                </Link>
              )}
            </div>
            <h1>{recipe.name}</h1>
            <p className={styles.introduction}>
              Explore the ingredients and follow each step to prepare this
              recipe at home.
            </p>
            <div className={styles.actions}>
              <a className={styles.jumpLink} href="#preparation">
                View preparation
                <ArrowDown aria-hidden="true" size={16} />
              </a>
              <span className={styles.saveAction}>
                <FavoriteButton recipeId={recipe.id} recipeName={recipe.name} />
              </span>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <span className={styles.butterAccent} aria-hidden="true" />
            <span className={styles.terracottaAccent} aria-hidden="true" />
            <div className={styles.heroImage}>
              <Image
                src={recipe.imageUrl}
                alt={recipe.name}
                fill
                priority
                sizes="(min-width: 1024px) 48vw, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.facts} aria-label="Recipe overview">
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

      <div className={`${styles.content} site-container`}>
        <aside className={styles.leftRail}>
          <section
            className={styles.ingredients}
            aria-labelledby="ingredients-title"
          >
            <header className={styles.sectionHeading}>
              <div>
                <p className={styles.eyebrow}>What you’ll need</p>
                <h2 id="ingredients-title">Ingredients</h2>
              </div>
              <span>{recipe.ingredients.length} items</span>
            </header>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={`${ingredient.name}-${index}`}>
                  <Leaf
                    className={styles.ingredientIcon}
                    size={18}
                    aria-hidden="true"
                  />
                  <span>{ingredient.name}</span>
                  <strong>{ingredient.measure ?? "As needed"}</strong>
                </li>
              ))}
            </ul>
          </section>

          <aside className={styles.kitchenNote}>
            <span>Kitchen note</span>
            <p>
              Read the full preparation and measure every ingredient before you
              begin.
            </p>
          </aside>
        </aside>

        <section
          className={styles.preparation}
          id="preparation"
          aria-labelledby="preparation-title"
        >
          <p className={styles.eyebrow}>Step by step</p>
          <header className={styles.preparationHeading}>
            <h2 id="preparation-title">Preparation</h2>
            <span>
              {steps.length} {steps.length === 1 ? "step" : "steps"}
            </span>
          </header>
          <ol className={styles.instructions}>
            {steps.map((step, index) => (
              <li className={styles.step} key={index}>
                <span className={styles.stepNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>Step {index + 1}</h3>
                  <p>{step}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  );
};

export default RecipePage;
