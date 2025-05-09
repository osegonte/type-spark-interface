
import React from "react";
import { useMemo } from "react";
import { Settings, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type ThemeMode = "light" | "dark" | "eye-care";

interface HeaderProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

const Header = ({ theme, onThemeChange }: HeaderProps) => {
  const ThemeIcon = useMemo(() => {
    return theme === "dark" ? Sun : Moon;
  }, [theme]);

  const nextTheme = useMemo(() => {
    if (theme === "light") return "dark";
    if (theme === "dark") return "eye-care";
    return "light";
  }, [theme]);

  return (
    <header className="border-b border-border py-3 px-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-2xl font-medium text-primary">TypeSpark</h1>
        <span className="ml-2 text-sm text-muted-foreground">Study Edition</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onThemeChange(nextTheme)}
          aria-label={`Switch to ${nextTheme} mode`}
        >
          <ThemeIcon className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
