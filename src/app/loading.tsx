import styles from "./page.module.scss";

const Loading = () => {
  return (
    <main className={`${styles.loadingPage} site-container`} aria-busy="true">
      <div className={styles.loadingHero} />
      <div className={styles.loadingHeading} />
      <div className={styles.loadingGrid}>
        {Array.from({ length: 4 }, (_, index) => (
          <div className={styles.loadingCard} key={index} />
        ))}
      </div>
    </main>
  );
};

export default Loading;
