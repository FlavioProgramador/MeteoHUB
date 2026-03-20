import { useState, useCallback } from "react";

const STORAGE_KEY = "meteohub_search_history";
const MAX_HISTORY = 5;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Adiciona cidade ao histórico (mais recente primeiro, sem duplicatas)
  const addToHistory = useCallback((city: string) => {
    const trimmed = city.trim();
    if (!trimmed) return;
    setHistory((prev) => {
      const filtered = prev.filter(
        (c) => c.toLowerCase() !== trimmed.toLowerCase()
      );
      const next = [trimmed, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Remove uma cidade específica do histórico
  const removeFromHistory = useCallback((city: string) => {
    setHistory((prev) => {
      const next = prev.filter(
        (c) => c.toLowerCase() !== city.toLowerCase()
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Limpa todo o histórico
  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, addToHistory, removeFromHistory, clearHistory };
}
