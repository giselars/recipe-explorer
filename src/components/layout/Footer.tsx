import Link from "next/link";
import styles from "./Footer.module.scss";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} site-container`}>
        <Link className={styles.brand} href="/">
          Recipe Explorer
        </Link>
        <p>Recipes for every table.</p>
        <p className={styles.copy}>
          © 2026 Recipe Explorer. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
