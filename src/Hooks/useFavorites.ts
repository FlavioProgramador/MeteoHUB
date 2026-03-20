import { useState, useEffect } from "react";

const STORAGE_KEY = "meteohub:favorites";
const MAX_FAVORITES = 8;

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  function addFavorite(city: string) {
    const trimmed = city.trim();
    if (!trimmed) return;
    setFavorites((prev) => {
      if (prev.includes(trimmed)) return prev;
      return [trimmed, ...prev].slice(0, MAX_FAVORITES);
    });
  }

  function removeFavorite(city: string) {
    setFavorites((prev) => prev.filter((c) => c !== city));
  }

  function isFavorite(city: string) {
    return favorites.includes(city.trim());
  }

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
