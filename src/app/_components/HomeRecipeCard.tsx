import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { Recipe } from "@/models/recipe";
import styles from "./HomeRecipeCard.module.scss";

interface Props {
  recipe: Recipe;
}

const getDescription = (instructions: string) => {
  const normalized = instructions.replace(/\s+/g, " ").trim();
  const firstSentence =
    normalized.match(/^.*?[.!?](?:\s|$)/)?.[0] ?? normalized;

  return firstSentence.length > 92
    ? `${firstSentence.slice(0, 89).trimEnd()}…`
    : firstSentence;
};

export const HomeRecipeCard = ({ recipe }: Props) => {
  const secondaryTag = recipe.tags[0] ?? recipe.area;

  return (
    <article className={styles.card}>
      <div className={styles.favorite}>
        <FavoriteButton
          recipeId={recipe.id}
          recipeName={recipe.name}
          variant="overlay"
        />
      </div>
      <Link href={`/recipes/${recipe.id}`} className={styles.link}>
        <div className={styles.imageWrap}>
          <Image
            className={styles.image}
            src={recipe.imageUrl}
            alt={recipe.name}
            fill
            sizes="(min-width: 1024px) 18rem, (min-width: 640px) 45vw, 100vw"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.tags}>
            {recipe.category && <span>{recipe.category}</span>}
            {secondaryTag && <span>{secondaryTag}</span>}
          </div>
          <h3>{recipe.name}</h3>
          <p>{getDescription(recipe.instructions)}</p>
        </div>
      </Link>
    </article>
  );
};
