import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../Hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bottomActions">
      <button className="themeToggle" onClick={toggleTheme} aria-label="Alterar Tema">
        {theme === "light" ? (
          <Moon size={22} className="themeToggleIcon" />
        ) : (
          <Sun size={22} className="themeToggleIcon" style={{ color: "#fbbf24" }} />
        )}
      </button>
    </div>
  );
};
