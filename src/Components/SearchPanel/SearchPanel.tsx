import { SearchBar } from "../SearchBar/SearchBar";
import { FavoriteCities } from "../FavoriteCities/FavoriteCities";
import { SearchHistory } from "../SearchHistory/SearchHistory";
import { LocationButton } from "../Buttons/LocationButton";
import { FavoriteButton } from "../Buttons/FavoriteButton";

interface SearchPanelProps {
  searchedCity: string;
  loading: boolean;
  weatherName: string | undefined;
  favorites: string[];
  history: string[];
  isFavorite: (city: string) => boolean;
  onSearch: (city: string) => void;
  onSuggestionClick: (lat: number, lon: number) => void;
  onLocationClick: () => void;
  onToggleFavorite: (city: string) => void;
  onSelectCity: (city: string) => void;
  onRemoveFavorite: (city: string) => void;
  onRemoveHistory: (city: string) => void;
  onClearHistory: () => void;
}

export function SearchPanel({
  searchedCity,
  loading,
  weatherName,
  favorites,
  history,
  isFavorite,
  onSearch,
  onSuggestionClick,
  onLocationClick,
  onToggleFavorite,
  onSelectCity,
  onRemoveFavorite,
  onRemoveHistory,
  onClearHistory,
}: SearchPanelProps) {
  return (
    <div className="searchContainer">
      <div className="searchRow">
        <SearchBar
          searchedCity={searchedCity}
          loading={loading}
          onSearch={onSearch}
          onSuggestionClick={onSuggestionClick}
        />

        <LocationButton loading={loading} onClick={onLocationClick} />

        {weatherName !== undefined && (
          <FavoriteButton
            isFavorite={isFavorite(weatherName)}
            onToggle={() => onToggleFavorite(weatherName)}
          />
        )}
      </div>

      <FavoriteCities
        favorites={favorites}
        currentCity={weatherName ?? ""}
        onSelect={onSelectCity}
        onRemove={onRemoveFavorite}
      />

      <SearchHistory
        history={history}
        onSelect={onSelectCity}
        onRemove={onRemoveHistory}
        onClear={onClearHistory}
      />
    </div>
  );
}
