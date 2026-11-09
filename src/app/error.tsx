"use client";

import { useEffect } from "react";
import styles from "./status.module.scss";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: Props) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={`${styles.status} site-container`}>
      <p className={styles.code}>Something went wrong</p>
      <h1>We couldn&apos;t bring this course to the table.</h1>
      <p>
        Please try again. If the problem continues, come back in a little while.
      </p>
      <div className={styles.actions}>
        <button type="button" onClick={reset}>
          Try again
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
