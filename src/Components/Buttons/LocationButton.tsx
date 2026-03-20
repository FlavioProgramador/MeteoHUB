interface LocationButtonProps {
  loading: boolean;
  onClick: () => void;
}

export function LocationButton({ loading, onClick }: LocationButtonProps) {
  return (
    <button
      className="locationBtn"
      type="button"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? "Buscando..." : "Usar Localização"}
    </button>
  );
}
