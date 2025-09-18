/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

// Brand colors
export const BRAND_ORANGE = "#FF8F70";
export const BRAND_ORANGE_LIGHT = "#FFF4F0";

// Neutral colors
const NEUTRAL_GREY_600 = "#666666";
const NEUTRAL_GREY_500 = "#999999";
const NEUTRAL_GREY_200 = "#e0e0e0";
const NEUTRAL_GREY_100 = "#f8f9fa";

// Dark theme specific
const DARK_BLUE = "#041c38";
const DARK_BLUE_LIGHT = "#283593";
const DARK_BLUE_BORDER = "#3f51b5";
const DARK_GOLD = "#ffbc91";
const DARK_GOLD_ICON = "#B8860B";
const DARK_CREAM = "#FFF8DC";

export const Colors = {
  light: {
    text: "#1a1a1a",
    background: "#ffffff",
    tint: BRAND_ORANGE,
    icon: NEUTRAL_GREY_600,
    tabIconDefault: NEUTRAL_GREY_500,
    tabIconSelected: BRAND_ORANGE,
    card: NEUTRAL_GREY_100,
    border: NEUTRAL_GREY_200,
    mosque: BRAND_ORANGE,
    mosqueLight: BRAND_ORANGE_LIGHT,
    prayer: "#1a1a1a",
    cardText: "#1a1a1a", // Dark text for card content
  },
  dark: {
    text: DARK_GOLD,
    background: DARK_BLUE,
    tint: BRAND_ORANGE,
    icon: DARK_GOLD_ICON,
    tabIconDefault: NEUTRAL_GREY_500,
    tabIconSelected: BRAND_ORANGE,
    card: DARK_BLUE_LIGHT,
    border: DARK_BLUE_BORDER,
    mosque: BRAND_ORANGE,
    mosqueLight: DARK_BLUE_BORDER,
    prayer: DARK_CREAM,
    cardText: "#ffffff", // White text for card content
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
