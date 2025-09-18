import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useMosqueBySlug, useMosqueData } from "@/hooks/use-mosque-data";
import { useAppTheme, useSelectedMosque } from "@/stores/app-store";
import {
  formatDate,
  formatTime,
  getPrayerStatus,
  getTimeUntilNext,
} from "@/utils/prayer-utils";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Prayer time display component
function PrayerTimesDisplay() {
  const { selectedMosqueSlug } = useSelectedMosque();
  const mosque = useMosqueBySlug(selectedMosqueSlug);
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const {
    data: mosqueData,
    isLoading,
    error,
    refetch,
  } = useMosqueData(selectedMosqueSlug);

  if (isLoading) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>Loading prayer times...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>
          Failed to load prayer times. Please check your connection.
        </ThemedText>
      </ThemedView>
    );
  }

  if (!mosqueData || !mosque) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>No prayer time data available.</ThemedText>
      </ThemedView>
    );
  }

  // Get today's prayer times (or the first available)
  const todaysTimes = mosqueData.timings[0];

  // Create prayer times array with status
  const prayerTimes = todaysTimes
    ? [
        { name: "Fajr", time: todaysTimes.fajr },
        { name: "Zuhr", time: todaysTimes.zuhr.split(" ")[0] }, // Remove multiple times
        { name: "Asr", time: todaysTimes.asr },
        { name: "Maghrib", time: todaysTimes.magrib },
        { name: "Isha", time: todaysTimes.isha },
      ]
    : [];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      <ThemedView style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <ThemedText style={styles.mosqueName}>{mosque.name}</ThemedText>
        <ThemedText style={styles.dateText}>
          {todaysTimes ? formatDate(todaysTimes.date) : "Today"}
        </ThemedText>
      </ThemedView>

      {prayerTimes.length > 0 && (
        <View style={styles.prayerTimesList}>
          {prayerTimes.map((prayer, index) => {
            const nextPrayerTime =
              index < prayerTimes.length - 1
                ? prayerTimes[index + 1].time
                : undefined;
            const status = getPrayerStatus(prayer.time, nextPrayerTime);

            return (
              <View
                key={prayer.name}
                style={[
                  styles.prayerRow,
                  {
                    // backgroundColor: colors.card,
                    borderColor:
                      status.status === "current" ? "#FF8F70" : colors.border,
                    borderWidth: status.status === "current" ? 2 : 1,
                  },
                ]}
              >
                <View style={styles.prayerLeftSection}>
                  <Text
                    style={[
                      styles.prayerName,
                      {
                        color:
                          status.status === "current" ? "#FF8F70" : colors.text,
                        opacity: status.status === "passed" ? 0.5 : 1,
                      },
                    ]}
                  >
                    {prayer.name}
                  </Text>
                  {status.status !== "upcoming" && (
                    <Text style={[styles.statusText, { color: status.color }]}>
                      {status.label}
                    </Text>
                  )}
                </View>
                <View style={styles.prayerRightSection}>
                  <Text
                    style={[
                      styles.prayerTime,
                      {
                        color:
                          status.status === "current"
                            ? "#FF8F70"
                            : colors.prayer,
                        opacity: status.status === "passed" ? 0.5 : 1,
                      },
                    ]}
                  >
                    {formatTime(prayer.time, false, false)}
                  </Text>
                  {status.status === "upcoming" && (
                    <Text style={[styles.timeUntil, { color: colors.text }]}>
                      in {getTimeUntilNext(prayer.time)}
                    </Text>
                  )}
                </View>
                <View style={styles.notificationIcon}>
                  <MaterialIcons
                    name="notifications-none"
                    size={20}
                    color={colors.icon}
                  />
                </View>
              </View>
            );
          })}
        </View>
      )}

      {mosque.jummahSchedule &&
        mosque.jummahSchedule.length > 0 &&
        (() => {
          // Filter for current week's Jummah times
          const now = new Date();
          const currentWeekStart = new Date(now);
          currentWeekStart.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
          const currentWeekEnd = new Date(currentWeekStart);
          currentWeekEnd.setDate(currentWeekStart.getDate() + 6); // End of current week (Saturday)

          const currentWeekJummah = mosque.jummahSchedule.filter((schedule) => {
            const scheduleDate = new Date(
              schedule.date.split("-").reverse().join("-")
            ); // Convert DD-MM-YYYY to YYYY-MM-DD
            return (
              scheduleDate >= currentWeekStart && scheduleDate <= currentWeekEnd
            );
          });

          if (currentWeekJummah.length === 0) return null;

          return (
            <View style={styles.jummahContainer}>
              {currentWeekJummah.map((schedule, index) => {
                // Check if today is Friday
                const today = new Date();
                const isFriday = today.getDay() === 5; // Friday is day 5

                return (
                  <View
                    key={index}
                    style={[
                      styles.jummahRow,
                      {
                        borderColor: colors.border,
                        borderWidth: 1,
                      },
                      isFriday && {
                        backgroundColor: colors.card,
                      },
                    ]}
                  >
                    <View style={styles.jummahLeftSection}>
                      <Text style={[styles.jummahName, { color: colors.text }]}>
                        Jummah
                      </Text>
                    </View>
                    <View style={styles.jummahRightSection}>
                      <Text
                        style={[styles.jummahTime, { color: colors.prayer }]}
                      >
                        {schedule.times
                          .map((time) => formatTime(time, false, false))
                          .join(" | ")}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })()}
    </ScrollView>
  );
}

export default function HomeScreen() {
  // Since mosque selection is now handled at the root level,
  // this screen will only be shown when a mosque is selected
  return <PrayerTimesDisplay />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  mosqueName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    opacity: 0.7,
  },
  prayerTimesList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  prayerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  prayerLeftSection: {
    flex: 1,
  },
  prayerRightSection: {
    alignItems: "flex-end",
    marginRight: 12,
  },
  notificationIcon: {
    padding: 4,
  },
  prayerName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 2,
  },
  prayerTime: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  timeUntil: {
    fontSize: 12,
    opacity: 0.7,
  },
  jummahContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
    gap: 8,
  },
  jummahRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  jummahLeftSection: {
    flex: 1,
  },
  jummahRightSection: {
    alignItems: "flex-end",
  },
  jummahName: {
    fontSize: 18,
    fontWeight: "600",
  },
  jummahTime: {
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "#d32f2f",
    textAlign: "center",
  },
});
