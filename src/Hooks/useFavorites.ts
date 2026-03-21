import { useLocalStorage } from "./useLocalStorage";

const STORAGE_KEY = "meteohub:favorites";
const MAX_FAVORITES = 8;

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>(STORAGE_KEY, []);

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
