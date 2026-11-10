"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.scss";

const links = [
  {
    href: "/cuisines",
    label: "Recipes",
    isActive: (path: string) =>
      path.startsWith("/cuisines") || path.startsWith("/recipes/"),
  },
  {
    href: "/categories",
    label: "Categories",
    isActive: (path: string) => path.startsWith("/categories"),
  },
];

export const NavLinks = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      {links.map(({ href, label, isActive }) => {
        const active = isActive(pathname);

        return (
          <Link
            key={href}
            className={active ? styles.activeNavLink : undefined}
            href={href}
            aria-current={active ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
};
