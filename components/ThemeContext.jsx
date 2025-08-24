import { createContext, useEffect, useState } from "react";
import { Appearance } from "react-native";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("light");

  useEffect(() => {
    if (currentTheme === "system") {
      const colorScheme = Appearance.getColorScheme();
      setCurrentTheme(colorScheme || "light");

      const listener = Appearance.addChangeListener((scheme) => {
        setCurrentTheme(scheme.colorScheme);
      });

      return () => listener.remove();
    }
  }, [currentTheme]);

  const toggleTheme = (theme) => {
    setCurrentTheme(theme);
  };

  const themeStyles = currentTheme === "dark"
    ? { backgroundColor: "#000000", textColor: "#ffffff" }
    : { backgroundColor: "#ffffff", textColor: "#000000" };

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme, themeStyles }}>
      {children}
    </ThemeContext.Provider>
  );
};
