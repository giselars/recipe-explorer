"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./HomeMotion.module.scss";

interface Props {
  children: ReactNode;
  className?: string;
}

export const HomeMotion = ({ children, className = "" }: Props) => {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = root.querySelectorAll<HTMLElement>("[data-home-reveal]");
    const map = root.querySelector<HTMLElement>("[data-home-map]");
    const reveal = (element: HTMLElement, immediate = false) => {
      element.dataset.homeState = immediate ? "visible" : "entered";
    };

    const entranceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target as HTMLElement);
          entranceObserver.unobserve(entry.target);
        });
      },
      {
        rootMargin: `0px 0px -${window.innerHeight * 0.1}px 0px`,
        threshold: 0,
      },
    );
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (map) map.dataset.homeActive = String(entry.isIntersecting);
    });

    elements.forEach((element) => {
      // Already visible content stays readable during hydration and reloads.
      if (
        preference.matches ||
        element.contains(document.activeElement) ||
        element.getBoundingClientRect().top < window.innerHeight * 0.9
      ) {
        reveal(element, true);
      } else {
        element.dataset.homeState = "pending";
        entranceObserver.observe(element);
      }
    });
    if (map) visibilityObserver.observe(map);

    const onFocus = (event: FocusEvent) => {
      const element = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-home-reveal]",
      );
      if (element) {
        reveal(element, true);
        entranceObserver.unobserve(element);
      }
    };
    const onPreferenceChange = () => {
      if (preference.matches) {
        elements.forEach((element) => reveal(element, true));
        entranceObserver.disconnect();
      }
    };
    root.addEventListener("focusin", onFocus);
    preference.addEventListener("change", onPreferenceChange);

    return () => {
      entranceObserver.disconnect();
      visibilityObserver.disconnect();
      root.removeEventListener("focusin", onFocus);
      preference.removeEventListener("change", onPreferenceChange);
      elements.forEach((element) => delete element.dataset.homeState);
      if (map) delete map.dataset.homeActive;
    };
  }, []);

  return (
    <main ref={rootRef} className={`${styles.root} ${className}`}>
      {children}
    </main>
  );
};
