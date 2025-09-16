/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

// Islamic-inspired color scheme
const tintColorLight = "#2c5f41"; // Dark green for light mode
const tintColorDark = "#FFD700"; // Gold for dark mode

export const Colors = {
  light: {
    text: "#1a1a1a",
    background: "#ffffff",
    tint: tintColorLight,
    icon: "#666666",
    tabIconDefault: "#999999",
    tabIconSelected: tintColorLight,
    card: "#f8f9fa",
    border: "#e0e0e0",
    mosque: "#2c5f41",
    mosqueLight: "#e8f5e8",
    prayer: "#1a472a",
  },
  dark: {
    text: "#ffbc91", // Gold text
    background: "#041c38", // Navy blue background
    tint: tintColorDark,
    icon: "#B8860B", // Dark goldenrod
    tabIconDefault: "#8B7355", // Muted gold
    tabIconSelected: tintColorDark,
    card: "#283593", // Lighter navy for cards
    border: "#3f51b5", // Blue border
    mosque: "#ff8f6e", // Gold for mosque names
    mosqueLight: "#3f51b5", // Light blue background
    prayer: "#FFF8DC", // Cream for prayer times
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
