import Link from "next/link";
import styles from "./status.module.scss";

const NotFound = () => {
  return (
    <div className={`${styles.status} site-container`}>
      <p className={styles.code}>404</p>
      <h1>This recipe is missing a key ingredient.</h1>
      <p>
        The page may have been taken off the menu. Let&apos;s find something
        delicious instead.
      </p>
      <div className={styles.actions}>
        <Link href="/categories">Explore categories</Link>
        <Link className={styles.secondary} href="/">
          Back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
