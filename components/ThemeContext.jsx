import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from "react"; // Added useContext import
import { Appearance } from 'react-native';

export const ThemeContext = createContext();

// Add this custom hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("light");
  
  // Rest of your ThemeProvider code remains the same...
  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setCurrentTheme(savedTheme);
        } else {
          // Use system theme if no saved preference
          const colorScheme = Appearance.getColorScheme();
          setCurrentTheme(colorScheme || "light");
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    
    loadTheme();
  }, []);
  
  // Save theme when it changes
  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem('theme', currentTheme);
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    };
    
    saveTheme();
  }, [currentTheme]);
  
  // Listen for system theme changes
  useEffect(() => {
    if (currentTheme === "system") {
      const listener = Appearance.addChangeListener(({ colorScheme }) => {
        setCurrentTheme(colorScheme || "light");
      });
      
      return () => listener.remove();
    }
  }, [currentTheme]);
  
  const toggleTheme = (theme) => {
    setCurrentTheme(theme);
  };
  
  const themeStyles = currentTheme === "dark"
    ? { 
        backgroundColor: "#121212", 
        textColor: "#ffffff",
        cardBackground: "#1e1e1e",
        borderColor: "#333333"
      }
    : { 
        backgroundColor: "#ffffff", 
        textColor: "#000000",
        cardBackground: "#ffffff",
        borderColor: "#e0e0e0"
      };
  
  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme, themeStyles }}>
      {children}
    </ThemeContext.Provider>
  );
};