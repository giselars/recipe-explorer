import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FavoriteButton } from "@/components";
import type { RecipeSummary } from "@/models/recipe";
import styles from "./CuisineRecipeCard.module.scss";

interface Props {
  recipe: RecipeSummary;
  index: number;
}

export const CuisineRecipeCard = ({ recipe, index }: Props) => (
  <article className={styles.card}>
    <Link className={styles.link} href={`/recipes/${recipe.id}`}>
      <span className={styles.image}>
        <Image
          src={recipe.imageUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 19rem, (min-width: 768px) 50vw, 100vw"
        />
      </span>
      <span className={styles.copy}>
        <small>{String(index).padStart(2, "0")}</small>
        <strong>{recipe.name}</strong>
        <span>
          View recipe <ArrowUpRight aria-hidden="true" size={13} />
        </span>
      </span>
    </Link>
    <span className={styles.save}>
      <FavoriteButton
        recipeId={recipe.id}
        recipeName={recipe.name}
        variant="overlay"
      />
    </span>
  </article>
);
