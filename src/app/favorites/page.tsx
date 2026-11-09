import type { Metadata } from "next";
import { FavoritesGrid } from "./_components";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Favorite recipes",
  description: "Return to the Recipe Explorer recipes you saved for later.",
};

const FavoritesPage = () => {
  return (
    <main className={`${styles.page} site-container`}>
      <header className={styles.intro}>
        <p>Your recipe box</p>
        <h1>Favorite recipes</h1>
        <span>
          Keep the dishes you love close and return whenever inspiration
          strikes.
        </span>
      </header>
      <FavoritesGrid />
    </main>
  );
};

export default FavoritesPage;
