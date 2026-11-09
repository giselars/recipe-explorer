"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import styles from "./HeroVideo.module.scss";

const videoUrl =
  "https://res.cloudinary.com/pdjoc1ti/video/upload/v1794218714/Fork_wrapping_pasta_carbonara_df906342_t1-8.mp4";
const posterUrl =
  "https://res.cloudinary.com/pdjoc1ti/video/upload/so_0/v1794218714/Fork_wrapping_pasta_carbonara_df906342_t1-8.jpg";

export const HeroVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let visible = false;

    const syncPlayback = () => {
      if (visible && !motionPreference.matches && !userPaused.current) {
        if (!video.getAttribute("src")) video.src = videoUrl;
        void video.play().catch(() => setPlaying(false));
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    });
    observer.observe(video);
    motionPreference.addEventListener("change", syncPlayback);

    return () => {
      observer.disconnect();
      motionPreference.removeEventListener("change", syncPlayback);
      video.pause();
    };
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      userPaused.current = false;
      if (!video.getAttribute("src")) video.src = videoUrl;
      void video.play().catch(() => setPlaying(false));
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        className={styles.video}
        poster={posterUrl}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedData={() => setAvailable(true)}
        onError={() => setAvailable(false)}
      />
      <button
        className={styles.control}
        type="button"
        onClick={togglePlayback}
        aria-label={
          playing ? "Pause background video" : "Play background video"
        }
      >
        {playing ? (
          <Pause size={14} aria-hidden="true" />
        ) : (
          <Play size={14} aria-hidden="true" />
        )}
        <span>{playing ? "Pause" : available ? "Play" : "Play film"}</span>
      </button>
    </>
  );
};
