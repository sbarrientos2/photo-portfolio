'use client';

import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-9 h-9 flex items-center justify-center rounded-full border border-[var(--color-gold)]/30 hover:border-[var(--color-gold)] transition-all duration-300 group"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun
          size={16}
          className="text-[var(--color-gold)] theme-icon group-hover:rotate-45 transition-transform duration-300"
        />
      ) : (
        <Moon
          size={16}
          className="text-[var(--color-gold)] theme-icon group-hover:-rotate-12 transition-transform duration-300"
        />
      )}
    </button>
  );
}
