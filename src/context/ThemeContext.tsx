
import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "eye-care";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    // Check for saved preference
    const savedTheme = localStorage.getItem("theme") as ThemeMode | null;
    
    // Check for system preference
    if (!savedTheme) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
    
    return savedTheme || "light";
  });
  
  useEffect(() => {
    // Remove all possible theme classes
    document.documentElement.classList.remove("light", "dark", "eye-care");
    
    // Add the current theme class
    document.documentElement.classList.add(theme);
    
    // Save preference
    localStorage.setItem("theme", theme);
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
