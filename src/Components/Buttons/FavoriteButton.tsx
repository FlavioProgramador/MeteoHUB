import { Star } from "lucide-react";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}

export function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
  return (
    <button
      className={`favIconBtn ${isFavorite ? "favIconActive" : ""}`}
      onClick={onToggle}
      aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Star
        size={22}
        style={{
          fill: isFavorite ? "#fbbf24" : "none",
          color: isFavorite ? "#fbbf24" : "currentColor",
          transition: "all 0.2s",
        }}
      />
    </button>
  );
}
