"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useSyncExternalStore,
} from "react";

const storageKey = "savory.favorite-recipe-ids";
const changeEvent = "savory:favorites-change";
const emptyFavoriteIds: string[] = [];
let favoriteIds = emptyFavoriteIds;
let isInitialized = false;

const readFavoriteIds = () => {
  try {
    const storedValue: unknown = JSON.parse(
      window.localStorage.getItem(storageKey) ?? "[]",
    );

    if (!Array.isArray(storedValue)) {
      return emptyFavoriteIds;
    }

    return Array.from(
      new Set(
        storedValue.filter(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0,
        ),
      ),
    );
  } catch {
    return emptyFavoriteIds;
  }
};

const getSnapshot = () => {
  if (!isInitialized) {
    favoriteIds = readFavoriteIds();
    isInitialized = true;
  }

  return favoriteIds;
};

const getServerSnapshot = () => emptyFavoriteIds;

const subscribe = (onStoreChange: () => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === storageKey) {
      favoriteIds = readFavoriteIds();
      onStoreChange();
    }
  };
  const handleLocalChange = () => onStoreChange();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(changeEvent, handleLocalChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(changeEvent, handleLocalChange);
  };
};

const toggleFavorite = (id: string) => {
  const normalizedId = id.trim();

  if (!normalizedId) {
    return;
  }

  const currentIds = getSnapshot();
  favoriteIds = currentIds.includes(normalizedId)
    ? currentIds.filter((favoriteId) => favoriteId !== normalizedId)
    : [...currentIds, normalizedId];
  window.localStorage.setItem(storageKey, JSON.stringify(favoriteIds));
  window.dispatchEvent(new Event(changeEvent));
};

interface FavoritesContextValue {
  favoriteIds: string[];
  isHydrated: boolean;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

interface Props {
  children: ReactNode;
}

export const FavoritesProvider = ({ children }: Props) => {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return (
    <FavoritesContext
      value={{
        favoriteIds: ids,
        isHydrated,
        isFavorite: (id) => ids.includes(id),
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);

  if (context === null) {
    throw new Error("useFavorites must be used within FavoritesProvider.");
  }

  return context;
};
