import { Star, X, MapPin } from "lucide-react";
import styles from "./FavoriteCities.module.css";

interface FavoriteCitiesProps {
  favorites: string[];
  currentCity: string;
  onSelect: (city: string) => void;
  onRemove: (city: string) => void;
}

export const FavoriteCities = ({
  favorites,
  currentCity,
  onSelect,
  onRemove,
}: FavoriteCitiesProps) => {
  if (favorites.length === 0) return null;

  return (
    <div className={styles.container}>
      <span className={styles.label}>
        <Star size={13} className={styles.labelIcon} />
        Favoritos
      </span>
      <div className={styles.chips}>
        {favorites.map((city, index) => (
          <div
            key={`${city}-${index}`}
            className={`${styles.chip} ${city === currentCity ? styles.active : ""}`}
          >
            <button
              className={styles.chipBtn}
              onClick={() => onSelect(city)}
              aria-label={`Buscar ${city}`}
            >
              <MapPin size={12} className={styles.chipIcon} />
              {city}
            </button>
            <button
              className={styles.removeBtn}
              onClick={() => onRemove(city)}
              aria-label={`Remover ${city} dos favoritos`}
            >
              <X size={11} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
