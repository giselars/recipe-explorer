"use client";

import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useState } from "react";
import type { RecipeCategory } from "@/models/recipe";
import styles from "./CategoryBrowser.module.scss";

interface Props {
  categories: RecipeCategory[];
}

const featuredNames = ["Vegetarian", "Pasta", "Seafood", "Dessert", "Chicken"];

const tones = [
  styles.sage,
  styles.peach,
  styles.blue,
  styles.blush,
  styles.gold,
];

const categoryHref = (category: RecipeCategory) =>
  `/categories/${encodeURIComponent(category.id)}`;

const pickFeatured = (categories: RecipeCategory[]) => {
  const preferred = featuredNames
    .map((name) =>
      categories.find(
        (category) =>
          category.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
      ),
    )
    .filter((category): category is RecipeCategory => Boolean(category));
  const usedIds = new Set(preferred.map((category) => category.id));

  return [
    ...preferred,
    ...categories.filter((category) => !usedIds.has(category.id)),
  ].slice(0, 5);
};

export const CategoryBrowser = ({ categories }: Props) => {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase());
  const featured = pickFeatured(categories);
  const featuredIds = new Set(featured.map((category) => category.id));
  const remaining = categories.filter(
    (category) => !featuredIds.has(category.id),
  );
  const filteredCategories = categories.filter((category) =>
    category.name.toLocaleLowerCase().includes(deferredQuery),
  );

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={`${styles.heroInner} site-container`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>The Recipe Explorer index</p>
            <h1>
              <span>Find your</span>
              <span>next favorite</span>
            </h1>
            <p className={styles.heroDescription}>
              Browse recipes by ingredient, occasion, and the kind of meal you
              feel like making.
            </p>
            <label className={styles.search}>
              <Search aria-hidden="true" size={18} />
              <span className={styles.srOnly}>Search categories</span>
              <input
                type="search"
                placeholder="Search categories…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>

          {featured.length > 0 && (
            <div className={styles.collage} aria-hidden="true">
              <span className={styles.collageCluster}>
                {featured[0]?.imageUrl && (
                  <span
                    className={`${styles.collageImage} ${styles.collageMain}`}
                  >
                    <Image
                      src={featured[0].imageUrl}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 15rem, 50vw"
                      priority
                    />
                  </span>
                )}
                {featured[1]?.imageUrl && (
                  <span
                    className={`${styles.collageImage} ${styles.collageLeft}`}
                  >
                    <Image
                      src={featured[1].imageUrl}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 13rem, 45vw"
                    />
                  </span>
                )}
                {featured[3]?.imageUrl && (
                  <span
                    className={`${styles.collageImage} ${styles.collageRight}`}
                  >
                    <Image
                      src={featured[3].imageUrl}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 13rem, 45vw"
                    />
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      </section>

      <section
        className={`${styles.discovery} site-container`}
        aria-label="Recipe categories"
      >
        <header className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>Browse the collection</p>
            <h2>{deferredQuery ? "Search results" : "Cook by craving"}</h2>
          </div>
          <p>
            {deferredQuery
              ? `${filteredCategories.length} ${filteredCategories.length === 1 ? "category" : "categories"} found`
              : "Start broad, then follow what looks delicious."}
          </p>
        </header>

        {!deferredQuery && featured.length > 0 && (
          <nav
            className={styles.discoveryActions}
            aria-label="More ways to discover recipes"
          >
            <a href="#all-categories">
              View all categories
              <ArrowRight aria-hidden="true" size={14} />
            </a>
            <Link href="/cuisines">
              Explore cuisines
              <ArrowUpRight aria-hidden="true" size={14} />
            </Link>
          </nav>
        )}

        {deferredQuery ? (
          filteredCategories.length > 0 ? (
            <div className={styles.resultsGrid}>
              {filteredCategories.map((category, index) => (
                <CategoryTile
                  category={category}
                  index={index}
                  key={category.id}
                />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <h2>No categories found</h2>
              <p>Try another word or clear your search.</p>
            </div>
          )
        ) : (
          <div className={styles.bento}>
            {featured.map((category, index) => (
              <CategoryTile
                category={category}
                index={index}
                key={category.id}
                featured={index === 0}
              />
            ))}
          </div>
        )}
      </section>

      {!deferredQuery && remaining.length > 0 && (
        <section className={styles.moreSection} id="all-categories">
          <div className={`${styles.moreInner} site-container`}>
            <div className={styles.moreCopy}>
              <p className={styles.eyebrow}>Keep exploring</p>
              <h2>Every kind of appetite</h2>
              <p>
                From quick breakfasts to slow Sunday dinners, there is always
                another place to begin.
              </p>
            </div>
            <div className={styles.moreGrid}>
              {remaining.map((category) => (
                <Link href={categoryHref(category)} key={category.id}>
                  <span>{category.name}</span>
                  <ArrowUpRight aria-hidden="true" size={15} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

interface CategoryTileProps {
  category: RecipeCategory;
  index: number;
  featured?: boolean;
}

const CategoryTile = ({
  category,
  index,
  featured = false,
}: CategoryTileProps) => (
  <article
    className={`${styles.categoryCard} ${tones[index % tones.length]} ${featured ? styles.featuredCard : ""}`}
  >
    <Link href={categoryHref(category)}>
      <span className={styles.categoryIndex}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3>{category.name}</h3>
      {featured && category.description && <p>{category.description}</p>}
      <span className={styles.cardVisual}>
        <span className={styles.imageHalo} />
        {category.imageUrl && (
          <span className={styles.categoryImage}>
            <Image
              src={category.imageUrl}
              alt=""
              fill
              sizes={featured ? "(min-width: 1024px) 22rem, 18rem" : "11rem"}
            />
          </span>
        )}
      </span>
      {featured ? (
        <span className={styles.exploreAction}>
          Explore category <ArrowRight aria-hidden="true" size={14} />
        </span>
      ) : (
        <span className={styles.cardArrow}>
          <ArrowUpRight aria-hidden="true" size={16} />
        </span>
      )}
    </Link>
  </article>
);
