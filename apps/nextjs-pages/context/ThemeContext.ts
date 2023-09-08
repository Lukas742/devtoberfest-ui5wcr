import { createContext, useContext } from "react";

const ThemeContext = createContext("sap_horizon");

export const ThemeContextProvider = ThemeContext.Provider;

export function useThemeContext() {
  return useContext(ThemeContext);
}