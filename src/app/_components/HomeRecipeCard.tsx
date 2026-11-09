import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { Recipe } from "@/models/recipe";
import styles from "./HomeRecipeCard.module.scss";

interface Props {
  recipe: Recipe;
  featured?: boolean;
}

export const HomeRecipeCard = ({ recipe, featured = false }: Props) => {
  const secondaryTag = recipe.tags[0] ?? recipe.area;

  return (
    <article
      className={`${styles.card} ${featured ? styles.featured : styles.compact}`}
    >
      <div className={styles.favorite}>
        <FavoriteButton
          recipeId={recipe.id}
          recipeName={recipe.name}
          variant="overlay"
        />
      </div>
      <div className={styles.link}>
        <Link href={`/recipes/${recipe.id}`} className={styles.imageWrap}>
          <Image
            className={styles.image}
            src={recipe.imageUrl}
            alt={recipe.name}
            fill
            sizes={
              featured
                ? "(min-width: 1024px) 50vw, 100vw"
                : "(min-width: 768px) 180px, 112px"
            }
          />
        </Link>
        <div className={styles.content}>
          <div className={styles.tags}>
            {recipe.category && <span>{recipe.category}</span>}
            {secondaryTag && <span>{secondaryTag}</span>}
          </div>
          <h3>
            <Link href={`/recipes/${recipe.id}`}>{recipe.name}</Link>
          </h3>
          <Link href={`/recipes/${recipe.id}`} className={styles.readRecipe}>
            View recipe <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
};
