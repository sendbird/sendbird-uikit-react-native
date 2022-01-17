import React from "react";

export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}

const UIKitThemeContext = React.createContext<{
  appearance: "light" | "dark";
} | null>(null);

export const UIKitThemeProvider: React.FC<{ appearance: "dark" | "light" }> = ({
  children,
  appearance,
}) => {
  return (
    <UIKitThemeContext.Provider value={{ appearance }}>
      {children}
    </UIKitThemeContext.Provider>
  );
};
