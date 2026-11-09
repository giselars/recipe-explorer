import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FavoriteButton } from "@/components";
import type { RecipeSummary } from "@/models/recipe";
import styles from "./CollectionRecipeCard.module.scss";

interface Props {
  recipe: RecipeSummary;
  variant?: "featured" | "portrait" | "standard" | "compact";
  priority?: boolean;
  index?: number;
}

export const CollectionRecipeCard = ({
  recipe,
  variant = "standard",
  priority = false,
  index,
}: Props) => (
  <article className={`${styles.card} ${styles[variant]}`}>
    <Link className={styles.link} href={`/recipes/${recipe.id}`}>
      <span className={styles.image}>
        <Image
          src={recipe.imageUrl}
          alt=""
          fill
          priority={priority}
          sizes={
            variant === "featured"
              ? "(min-width: 1024px) 52rem, 100vw"
              : "(min-width: 1024px) 26rem, (min-width: 768px) 50vw, 100vw"
          }
        />
      </span>
      {variant === "featured" && (
        <span className={styles.featuredLabel}>
          {String(index ?? 1).padStart(2, "0")} / Collection pick
        </span>
      )}
      <span className={styles.copy}>
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
