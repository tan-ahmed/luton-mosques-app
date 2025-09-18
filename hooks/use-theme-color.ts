/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@/constants/theme";
import { useAppTheme } from "@/stores/app-store";

/**
 * Hook to get theme-appropriate colors
 * @param props - Object with optional light and dark color overrides
 * @param colorName - Name of the color from the theme
 * @returns The appropriate color for the current theme
 * @example
 * useThemeColor({ light: "#000", dark: "#fff" }, "text")
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { theme } = useAppTheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
