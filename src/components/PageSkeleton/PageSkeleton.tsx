import styles from "./PageSkeleton.module.scss";

export const PageSkeleton = () => {
  return (
    <div
      className={`${styles.page} site-container`}
      aria-busy="true"
      aria-label="Loading recipes"
    >
      <div className={styles.heading} />
      <div className={styles.grid}>
        {Array.from({ length: 6 }, (_, index) => (
          <div className={styles.card} key={index} />
        ))}
      </div>
    </div>
  );
};
