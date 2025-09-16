import { MosqueSelector } from "@/components/mosque-selector";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  useAppStore,
  useAppTheme,
  useSelectedMosque,
} from "@/stores/app-store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export const unstable_settings = {
  anchor: "(tabs)",
};

function AppContent() {
  const { isDark } = useAppTheme();
  const { selectedMosqueSlug, isLoading } = useSelectedMosque();
  const loadInitialData = useAppStore((state) => state.loadInitialData);

  // Load initial data on mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Show loading state while checking for saved mosque
  if (isLoading) {
    return (
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <ThemedView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ThemedText>Loading...</ThemedText>
        </ThemedView>
        <StatusBar style={isDark ? "light" : "dark"} />
      </ThemeProvider>
    );
  }

  // Show mosque selector if no mosque is selected
  if (!selectedMosqueSlug) {
    return (
      <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <MosqueSelector />
        <StatusBar style={isDark ? "light" : "dark"} />
      </ThemeProvider>
    );
  }

  // Show full app with tabs if mosque is selected
  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
