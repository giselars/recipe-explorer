"use client";

import { ArrowDown, ArrowUpRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import styles from "./CuisineBrowser.module.scss";

interface FeaturedCuisine {
  name: string;
  imageUrl: string | null;
}

interface Props {
  cuisines: string[];
  featuredCuisines: FeaturedCuisine[];
}

const displayNames: Record<string, string> = {
  Italian: "Italy",
  Japanese: "Japan",
  Mexican: "Mexico",
  French: "France",
  Indian: "India",
};

const descriptions: Record<string, string> = {
  Italian: "Comforting classics, regional traditions, and generous tables.",
  Japanese: "Precision, seasonality, and quiet balance.",
  Mexican: "Bright flavor, deep tradition, and joyful color.",
  French: "Bistro favorites and enduring technique.",
  Indian: "Layered spices and remarkable regional range.",
};

const cuisineHref = (cuisine: string) =>
  `/cuisines/${encodeURIComponent(cuisine)}`;

export const CuisineBrowser = ({ cuisines, featuredCuisines }: Props) => {
  const [query, setQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("A");
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase());
  const alphabet = useMemo(
    () =>
      Array.from(
        new Set(
          cuisines.map((cuisine) => cuisine.charAt(0).toLocaleUpperCase()),
        ),
      ).sort(),
    [cuisines],
  );
  const filteredCuisines = cuisines.filter((cuisine) => {
    if (deferredQuery) {
      return cuisine.toLocaleLowerCase().includes(deferredQuery);
    }

    return selectedLetter === "ALL"
      ? true
      : cuisine.toLocaleUpperCase().startsWith(selectedLetter);
  });
  const heroDishes = [
    { name: "Mexican", className: styles.heroPhotoAmericas },
    { name: "Italian", className: styles.heroPhotoEurope },
    { name: "Japanese", className: styles.heroPhotoAsia },
  ].map(({ name, className }) => ({
    className,
    cuisine: featuredCuisines.find((cuisine) => cuisine.name === name),
  }));

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={`${styles.heroInner} site-container`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>The global table</p>
            <h1>Taste the world</h1>
            <p className={styles.heroDescription}>
              Travel through recipes, traditions, and everyday dishes from
              kitchens around the globe.
            </p>
            <label className={styles.search}>
              <Search aria-hidden="true" size={18} />
              <span className={styles.srOnly}>Search cuisines</span>
              <input
                type="search"
                placeholder="Search cuisines or regions…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>

          <div className={styles.heroVisual} aria-hidden="true">
            <span className={styles.worldMap} />
            {heroDishes.map(
              ({ cuisine, className }) =>
                cuisine?.imageUrl && (
                  <span
                    className={`${styles.heroPhoto} ${className}`}
                    key={cuisine.name}
                  >
                    <Image
                      src={cuisine.imageUrl}
                      alt=""
                      fill
                      priority
                      sizes="6rem"
                    />
                  </span>
                ),
            )}
          </div>
        </div>
      </section>

      {!deferredQuery && featuredCuisines.length > 0 && (
        <section className={`${styles.featuredSection} site-container`}>
          <header className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Featured journeys</p>
              <h2>Begin with a destination</h2>
            </div>
            <a href="#cuisine-atlas">
              Browse the A–Z index
              <ArrowDown aria-hidden="true" size={14} />
            </a>
          </header>

          <div className={styles.mosaic}>
            {featuredCuisines.map((cuisine, index) => (
              <article
                className={`${styles.journeyCard} ${index === 0 ? styles.primaryJourney : ""}`}
                key={cuisine.name}
              >
                <Link href={cuisineHref(cuisine.name)}>
                  {cuisine.imageUrl && (
                    <Image
                      src={cuisine.imageUrl}
                      alt=""
                      fill
                      sizes={
                        index === 0
                          ? "(min-width: 1024px) 38rem, 100vw"
                          : "(min-width: 1024px) 19rem, 50vw"
                      }
                    />
                  )}
                  <span className={styles.imageShade} />
                  <span className={styles.journeyIndex}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.journeyCopy}>
                    <strong>
                      {displayNames[cuisine.name] ?? cuisine.name}
                    </strong>
                    <span>
                      {descriptions[cuisine.name] ??
                        "Explore this recipe collection."}
                    </span>
                  </span>
                  <ArrowUpRight
                    className={styles.journeyArrow}
                    aria-hidden="true"
                    size={18}
                  />
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      <section
        className={`${styles.atlas} ${deferredQuery ? styles.searchAtlas : ""}`}
        id="cuisine-atlas"
      >
        <div className={`${styles.atlasInner} site-container`}>
          <header className={styles.atlasHeader}>
            <div>
              <p className={styles.eyebrow}>
                {deferredQuery ? "Search results" : "The complete atlas"}
              </p>
              <h2>
                {deferredQuery
                  ? `Cuisines matching “${query.trim()}”`
                  : "Cuisines from A to Z"}
              </h2>
            </div>
            <p aria-live="polite">
              {filteredCuisines.length}{" "}
              {filteredCuisines.length === 1 ? "cuisine" : "cuisines"}
            </p>
          </header>

          {!deferredQuery && (
            <div
              className={styles.alphabet}
              aria-label="Filter cuisines by first letter"
            >
              <button
                className={
                  selectedLetter === "ALL" ? styles.activeLetter : undefined
                }
                type="button"
                onClick={() => setSelectedLetter("ALL")}
              >
                All
              </button>
              {alphabet.map((letter) => (
                <button
                  className={
                    selectedLetter === letter ? styles.activeLetter : undefined
                  }
                  type="button"
                  onClick={() => setSelectedLetter(letter)}
                  key={letter}
                >
                  {letter}
                </button>
              ))}
            </div>
          )}

          {deferredQuery && filteredCuisines.length > 0 && (
            <p className={styles.searchHint}>
              Select a cuisine to explore its recipe collection.
            </p>
          )}

          {filteredCuisines.length > 0 ? (
            <div className={styles.directory}>
              {filteredCuisines.map((cuisine) => (
                <Link href={cuisineHref(cuisine)} key={cuisine}>
                  <span className={styles.cuisineLinkCopy}>
                    {deferredQuery && <small>Recipe collection</small>}
                    <span>{cuisine}</span>
                  </span>
                  {deferredQuery && (
                    <span className={styles.cuisineMonogram} aria-hidden="true">
                      {cuisine.slice(0, 2).toLocaleUpperCase()}
                    </span>
                  )}
                  <span className={styles.directoryArrow}>
                    <ArrowUpRight aria-hidden="true" size={14} />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <h2>No cuisines found</h2>
              <p>Try another word or clear your search.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
