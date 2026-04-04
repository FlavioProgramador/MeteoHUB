import { useCallback, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { backendApi } from "../Services/backend";
import { useLocalStorage } from "./useLocalStorage";

const STORAGE_KEY = "meteohub_search_history";
const MAX_HISTORY = 5;

export function useSearchHistory() {
  const [history, setHistory] = useLocalStorage<string[]>(STORAGE_KEY, []);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      backendApi
        .get("/history")
        .then((res) => {
          if (res.data.success) {
            const apiHistory = res.data.data.map((h: { cityName: string }) => h.cityName);
            setHistory(apiHistory.slice(0, MAX_HISTORY));
          }
        })
        .catch(console.error);
    }
  }, [isAuthenticated, setHistory]);

  const addToHistory = useCallback(
    async (city: string) => {
      const trimmed = city.trim();
      if (!trimmed) return;

      if (isAuthenticated) {
        try {
          await backendApi.post("/history", {
            cityId: trimmed,
            cityName: trimmed,
            country: "BR",
            lat: 0,
            lon: 0,
          });
        } catch (err) {
          console.error("Erro ao salvar histórico", err);
        }
      }

      setHistory((prev) => {
        const filtered = prev.filter(
          (c) => c.toLowerCase() !== trimmed.toLowerCase(),
        );
        return [trimmed, ...filtered].slice(0, MAX_HISTORY);
      });
    },
    [isAuthenticated, setHistory],
  );

  const removeFromHistory = useCallback(
    (city: string) => {
      setHistory((prev) => {
        return prev.filter((c) => c.toLowerCase() !== city.toLowerCase());
      });
    },
    [setHistory],
  );

  const clearHistory = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await backendApi.delete("/history");
      } catch (err) {
        console.error("Erro ao limpar histórico", err);
      }
    }
    setHistory([]);
  }, [isAuthenticated, setHistory]);

  return { history, addToHistory, removeFromHistory, clearHistory };
}
