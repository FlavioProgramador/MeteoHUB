import { Clock, X, Trash2 } from "lucide-react";
import styles from "./SearchHistory.module.css";

interface SearchHistoryProps {
  history: string[];
  onSelect: (city: string) => void;
  onRemove: (city: string) => void;
  onClear: () => void;
}

export const SearchHistory = ({
  history,
  onSelect,
  onRemove,
  onClear,
}: SearchHistoryProps) => {
  if (history.length === 0) return null;

  return (
    <div className={styles.container}>
      <span className={styles.label}>
        <Clock size={13} className={styles.labelIcon} />
        Recentes
      </span>

      <div className={styles.chips}>
        {history.map((city, index) => (
          <div key={`${city}-${index}`} className={styles.chip}>
            <button
              className={styles.chipBtn}
              onClick={() => onSelect(city)}
              aria-label={`Buscar ${city} novamente`}
            >
              {city}
            </button>
            <button
              className={styles.removeBtn}
              onClick={() => onRemove(city)}
              aria-label={`Remover ${city} do histórico`}
            >
              <X size={11} />
            </button>
          </div>
        ))}
      </div>
      
      <button className={styles.clearBtn} onClick={onClear} aria-label="Limpar histórico">
        <Trash2 size={13} />
      </button>
    </div>
  );
};
