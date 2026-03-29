import { useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { backendApi } from "../Services/backend";
import { useLocalStorage } from "./useLocalStorage";

const STORAGE_KEY = "meteohub:favorites";
const MAX_FAVORITES = 8;

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>(STORAGE_KEY, []);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      backendApi
        .get("/favorites")
        .then((res) => {
          if (res.data.success) {
            const apiFavorites = res.data.data.map((fav: any) => fav.cityName);
            setFavorites(apiFavorites);
          }
        })
        .catch(console.error);
    }
  }, [isAuthenticated, setFavorites]);

  async function addFavorite(city: string) {
    const trimmed = city.trim();
    if (!trimmed) return;

    if (isAuthenticated) {
      try {
        await backendApi.post("/favorites", {
          cityId: trimmed, 
          cityName: trimmed,
          country: "BR",
          lat: 0,
          lon: 0,
        });
      } catch (err) {
        console.error("Erro ao salvar favorito no banco", err);
      }
    }

    setFavorites((prev) => {
      if (prev.includes(trimmed)) return prev;
      return [trimmed, ...prev].slice(0, MAX_FAVORITES);
    });
  }

  async function removeFavorite(city: string) {
    const trimmed = city.trim();
    if (isAuthenticated) {
      try {
        await backendApi.delete(`/favorites/${encodeURIComponent(trimmed)}`);
      } catch (err) {
        console.error("Erro ao excluir favorito do banco", err);
      }
    }
    setFavorites((prev) => prev.filter((c) => c !== trimmed));
  }

  function isFavorite(city: string) {
    return favorites.includes(city.trim());
  }

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
