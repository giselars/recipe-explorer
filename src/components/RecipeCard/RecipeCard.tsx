import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { RecipeSummary } from "@/models/recipe";
import styles from "./RecipeCard.module.scss";

interface Props {
  recipe: RecipeSummary;
}

export const RecipeCard = ({ recipe }: Props) => {
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
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          />
        </div>
        <div className={styles.content}>
          {recipe.category && (
            <span className={styles.badge}>{recipe.category}</span>
          )}
          <h2>{recipe.name}</h2>
          <span>View recipe</span>
        </div>
      </Link>
    </article>
  );
};
