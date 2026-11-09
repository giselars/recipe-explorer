"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./Header.module.scss";

export const StickyHeader = ({ children }: { children: ReactNode }) => {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let frame: number | null = null;
    const update = () => {
      header.dataset.scrolled = String(window.scrollY > 64);
      frame = null;
    };
    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header ref={headerRef} className={styles.header}>
      {children}
    </header>
  );
};
