import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useColorScheme } from "@/components/useColorScheme";
import { getTheme, type Theme } from "@/lib/theme";

const ThemeContext = createContext<Theme>(getTheme("light"));

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const theme = useMemo(() => getTheme(scheme), [scheme]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

export function useThemedStyles<T>(factory: (theme: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => factory(theme), [theme]);
}
