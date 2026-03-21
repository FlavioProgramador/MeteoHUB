import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

const STORAGE_KEY = "meteohub_search_history";
const MAX_HISTORY = 5;

export function useSearchHistory() {
  const [history, setHistory] = useLocalStorage<string[]>(STORAGE_KEY, []);

  // Adiciona cidade ao histórico (mais recente primeiro, sem duplicatas)
  const addToHistory = useCallback((city: string) => {
    const trimmed = city.trim();
    if (!trimmed) return;
    setHistory((prev) => {
      const filtered = prev.filter(
        (c) => c.toLowerCase() !== trimmed.toLowerCase()
      );
      const next = [trimmed, ...filtered].slice(0, MAX_HISTORY);
      return next;
    });
  }, [setHistory]);

  // Remove uma cidade específica do histórico
  const removeFromHistory = useCallback((city: string) => {
    setHistory((prev) => {
      const next = prev.filter(
        (c) => c.toLowerCase() !== city.toLowerCase()
      );
      return next;
    });
  }, [setHistory]);

  // Limpa todo o histórico
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, [setHistory]);

  return { history, addToHistory, removeFromHistory, clearHistory };
}
