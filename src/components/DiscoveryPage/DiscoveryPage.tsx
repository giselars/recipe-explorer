import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./DiscoveryPage.module.scss";

interface Props {
  eyebrow: string;
  title: string;
  description: string;
  controls?: ReactNode;
  children: ReactNode;
}

export const DiscoveryPage = ({
  eyebrow,
  title,
  description,
  controls,
  children,
}: Props) => (
  <div className={styles.page}>
    <header className={styles.hero}>
      <div className={`${styles.heroInner} site-container`}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1>{title}</h1>
        <p className={styles.description}>{description}</p>
        {controls}
      </div>
    </header>
    <div className={`${styles.content} site-container`}>{children}</div>
    <section className={styles.discovery} aria-labelledby="keep-discovering">
      <div className="site-container">
        <p className={styles.eyebrow}>A little more inspiration</p>
        <h2 id="keep-discovering">Keep discovering</h2>
        <p>There’s always something new to bring to the table.</p>
        <div className={styles.links}>
          <Link href="/categories">
            Explore categories <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <Link href="/cuisines">
            Explore cuisines <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  </div>
);
