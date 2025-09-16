import { useQuery } from "@tanstack/react-query";

// Base GitHub raw URL for your repository
const BASE_URL =
  "https://raw.githubusercontent.com/tan-ahmed/inspire-prayer-scraper/main";

// Types based on your data structure
export interface MosqueIndexEntry {
  name: string;
  slug: string;
  dataFile: string;
  hasData: boolean;
  jummahSchedule: {
    date: string;
    times: string[];
  }[];
}

export interface MosqueIndex {
  mosques: MosqueIndexEntry[];
  lastUpdated: string;
}

export interface PrayerTiming {
  day: string;
  date: string;
  fajr: string;
  zuhr: string;
  asr: string;
  magrib: string;
  isha: string;
}

export interface MosqueData {
  mosqueName: string;
  timings: PrayerTiming[];
}

// Hook to fetch the mosque index
export function useMosqueIndex() {
  return useQuery<MosqueIndex>({
    queryKey: ["mosque-index"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/mosque-index.json`);
      if (!response.ok) {
        throw new Error("Failed to fetch mosque index");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

// Hook to fetch individual mosque prayer data
export function useMosqueData(mosqueSlug: string | null) {
  return useQuery<MosqueData>({
    queryKey: ["mosque-data", mosqueSlug],
    queryFn: async () => {
      if (!mosqueSlug) {
        throw new Error("No mosque selected");
      }

      const response = await fetch(`${BASE_URL}/data/${mosqueSlug}.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data for mosque: ${mosqueSlug}`);
      }
      return response.json();
    },
    enabled: !!mosqueSlug, // Only run query if mosqueSlug is provided
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

// Helper hook to get a specific mosque from the index
export function useMosqueBySlug(slug: string | null) {
  const { data: mosqueIndex } = useMosqueIndex();

  if (!slug || !mosqueIndex) {
    return null;
  }

  return (
    mosqueIndex.mosques.find(
      (mosque: MosqueIndexEntry) => mosque.slug === slug
    ) || null
  );
}
