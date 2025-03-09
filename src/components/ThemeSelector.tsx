import React from 'react';

interface ThemeSelectorProps {
  themes: string[];
  onSelect: (theme: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ themes, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-4">
      {themes.map((theme) => (
        <button
          key={theme}
          onClick={() => onSelect(theme)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {theme}
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;
