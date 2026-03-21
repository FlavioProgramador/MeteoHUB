import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { getCitySuggestions } from "../../Services/api";
import type { CitySuggestion } from "../../Types/geocoding";

interface SearchBarProps {
  onSearch: (city: string) => void;
  onSuggestionClick: (lat: number, lon: number, name: string) => void;
  loading: boolean;
  searchedCity: string;
}

export const SearchBar = ({ onSearch, onSuggestionClick, loading, searchedCity }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const skipNextSuggestion = useRef(false);
  const isFocused = useRef(false);

  // Sincroniza a caixa de texto caso a pesquisa venha dos Favoritos/Recentes
  // e bloqueia a abertura do dropdown
  useEffect(() => {
    if (searchedCity && searchedCity !== searchTerm) {
      skipNextSuggestion.current = true;
      setSearchTerm(searchedCity);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedCity]);

  useEffect(() => {
    if (skipNextSuggestion.current) {
      skipNextSuggestion.current = false;
      return;
    }
    if (searchTerm.trim().length > 2) {
      const delayDebounceFn = setTimeout(async () => {
        const data = (await getCitySuggestions(searchTerm)) as CitySuggestion[];
        
        // Remove cidades duplicadas retornadas pela API filtrando pelo nome e estado
        const uniqueData = data.filter((v: CitySuggestion, i: number, a: CitySuggestion[]) => 
          a.findIndex((t: CitySuggestion) => t.name === v.name && t.state === v.state && t.country === v.country) === i
        );

        setSuggestions(uniqueData);
        
        // Exibe a lista SOMENTE se o usuário ainda estiver com o input focado.
        if (isFocused.current) {
          setShowSuggestions(true);
        }
      }, 600);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowSuggestions(false);
    isFocused.current = false;
    if (!searchTerm.trim()) return;
    onSearch(searchTerm);
  }

  function handleSuggestionClickLocal(sug: CitySuggestion) {
    setShowSuggestions(false);
    setSuggestions([]);
    skipNextSuggestion.current = true;
    setSearchTerm(sug.name);
    
    if (sug.lat && sug.lon) {
      onSuggestionClick(sug.lat, sug.lon, sug.name);
    } else {
      onSearch(sug.name);
    }
  }

  return (
    <form className="searchForm" onSubmit={handleSubmit}>
      <div className="searchWrapper">
        <input
          className="searchInput"
          type="text"
          name="city"
          placeholder="Digite o nome da cidade"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            isFocused.current = true;
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          onBlur={() => {
            isFocused.current = false;
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          autoComplete="off"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestionsList">
            {suggestions.map((sug, i) => (
              <li key={i} onClick={() => handleSuggestionClickLocal(sug)}>
                {sug.name}{sug.state ? `, ${sug.state}` : ""} - {sug.country}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="searchIconBtn" type="submit" disabled={loading} aria-label="Buscar">
        <Search size={22} className="searchIconBlue" />
      </button>
    </form>
  );
};
