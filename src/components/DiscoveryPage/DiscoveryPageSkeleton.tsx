import { DiscoveryPage } from "./DiscoveryPage";
import styles from "./DiscoveryPage.module.scss";

export const DiscoveryPageSkeleton = ({
  favorites = false,
}: {
  favorites?: boolean;
}) => (
  <DiscoveryPage
    eyebrow={favorites ? "Your recipe box" : "Find your next meal"}
    title={favorites ? "Favorite recipes" : "Search recipes"}
    description={
      favorites
        ? "Keep the dishes you love close and return whenever inspiration strikes."
        : "A familiar favorite or a new discovery. What are you craving?"
    }
  >
    <div aria-busy="true" aria-label="Loading recipes" className={styles.grid}>
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className={styles.skeleton} />
      ))}
    </div>
  </DiscoveryPage>
);
