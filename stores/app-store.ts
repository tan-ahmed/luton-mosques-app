import { Colors } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface AppState {
  // Mosque selection
  selectedMosqueSlug: string | null;
  isLoading: boolean;

  // Settings
  theme: "light" | "dark";

  // Actions
  setSelectedMosque: (slug: string) => Promise<void>;
  clearSelectedMosque: () => Promise<void>;
  setTheme: (theme: "light" | "dark") => Promise<void>;
  loadInitialData: () => Promise<void>;
}

const SELECTED_MOSQUE_KEY = "selected_mosque_slug";
const SETTINGS_KEY = "app_settings";

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  selectedMosqueSlug: null,
  isLoading: true,
  theme: "dark", // Default to dark mode

  // Mosque actions
  setSelectedMosque: async (slug: string) => {
    try {
      await AsyncStorage.setItem(SELECTED_MOSQUE_KEY, slug);
      set({ selectedMosqueSlug: slug });
    } catch (error) {
      console.error("Error saving selected mosque:", error);
      throw error;
    }
  },

  clearSelectedMosque: async () => {
    try {
      await AsyncStorage.removeItem(SELECTED_MOSQUE_KEY);
      set({ selectedMosqueSlug: null });
    } catch (error) {
      console.error("Error clearing selected mosque:", error);
      throw error;
    }
  },

  // Theme actions
  setTheme: async (theme: "light" | "dark") => {
    try {
      const settings = { theme };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      set({ theme });
    } catch (error) {
      console.error("Error saving theme:", error);
      throw error;
    }
  },

  // Load initial data from storage
  loadInitialData: async () => {
    try {
      // Load mosque selection
      const mosqueSlug = await AsyncStorage.getItem(SELECTED_MOSQUE_KEY);

      // Load settings
      const settingsData = await AsyncStorage.getItem(SETTINGS_KEY);
      const settings = settingsData
        ? JSON.parse(settingsData)
        : { theme: "dark" };

      set({
        selectedMosqueSlug: mosqueSlug,
        theme: settings.theme || "dark",
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading initial data:", error);
      set({ isLoading: false });
    }
  },
}));

// Computed values
export const useSelectedMosque = () => {
  const selectedMosqueSlug = useAppStore((state) => state.selectedMosqueSlug);
  const isLoading = useAppStore((state) => state.isLoading);
  const setSelectedMosque = useAppStore((state) => state.setSelectedMosque);
  const clearSelectedMosque = useAppStore((state) => state.clearSelectedMosque);

  return {
    selectedMosqueSlug,
    isLoading,
    setSelectedMosque,
    clearSelectedMosque,
    hasSelectedMosque: !!selectedMosqueSlug,
  };
};

export const useSettings = () => {
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);

  return {
    settings: { theme },
    toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
  };
};

export const useAppTheme = () => {
  const theme = useAppStore((state) => state.theme);

  return {
    theme,
    colors: Colors[theme],
    isDark: theme === "dark",
    isLight: theme === "light",
  };
};
