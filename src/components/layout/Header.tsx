import { Search } from "lucide-react";
import Link from "next/link";
import { FavoritesLink } from "./FavoritesLink";
import { NavLinks } from "./NavLinks";
import styles from "./Header.module.scss";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={`${styles.inner} site-container`}>
        <Link
          className={styles.brand}
          href="/"
          aria-label="Recipe Explorer home"
        >
          Recipe Explorer
        </Link>
        <NavLinks />
        <div className={styles.actions}>
          <Link
            className={styles.action}
            href="/search"
            aria-label="Search recipes"
          >
            <Search size={19} strokeWidth={1.8} aria-hidden="true" />
          </Link>
          <FavoritesLink />
        </div>
      </div>
    </header>
  );
};
