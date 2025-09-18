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
import React from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Prayer time display component
function PrayerTimesDisplay() {
  const { selectedMosqueSlug } = useSelectedMosque();
  const mosque = useMosqueBySlug(selectedMosqueSlug);
  const { colors } = useAppTheme();
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
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.mosqueTitle}>
          {mosque.name}
        </ThemedText>
        <ThemedText style={styles.lastUpdated}>
          {todaysTimes ? formatDate(todaysTimes.date) : "Today"}
        </ThemedText>
      </ThemedView>

      {prayerTimes.length > 0 && (
        <ThemedView
          style={[
            styles.prayerTimesContainer,
            { backgroundColor: colors.card },
          ]}
        >
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
                  { borderBottomColor: colors.border },
                  status.backgroundColor !== "transparent" && {
                    backgroundColor: status.backgroundColor,
                    borderRadius: 8,
                    marginVertical: 2,
                    paddingHorizontal: 12,
                  },
                ]}
              >
                <View style={styles.prayerLeftSection}>
                  <Text
                    style={[
                      styles.prayerName,
                      {
                        color:
                          status.status === "current" ? "#FFF" : colors.mosque,
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
                          status.status === "current" ? "#FFF" : colors.prayer,
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
              </View>
            );
          })}
        </ThemedView>
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
            <ThemedView
              style={[
                styles.jummahContainer,
                { backgroundColor: colors.mosqueLight },
              ]}
            >
              <ThemedText
                type="subtitle"
                style={[styles.jummahTitle, { color: colors.mosque }]}
              >
                This Week&apos;s Jummah
              </ThemedText>
              {currentWeekJummah.map((schedule, index) => (
                <View key={index} style={styles.jummahRow}>
                  {/* <Text style={[styles.jummahDate, { color: colors.mosque }]}>
                    {formatDate(schedule.date)}
                  </Text> */}
                  <View style={styles.jummahTimes}>
                    {schedule.times.map((time, timeIndex) => (
                      <Text
                        key={timeIndex}
                        style={[
                          styles.jummahTime,
                          {
                            color: colors.prayer,
                            backgroundColor: colors.background,
                          },
                        ]}
                      >
                        {formatTime(time, false, false)}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </ThemedView>
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
    padding: 20,
    borderBottomWidth: 1,
  },
  mosqueTitle: {
    textAlign: "center",
    marginBottom: 8,
  },
  lastUpdated: {
    textAlign: "center",
    fontSize: 14,
    opacity: 0.7,
  },
  prayerTimesContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  prayerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  prayerLeftSection: {
    flex: 1,
  },
  prayerRightSection: {
    alignItems: "flex-end",
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
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  jummahTitle: {
    textAlign: "center",
    marginBottom: 16,
  },
  jummahRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  jummahDate: {
    fontSize: 14,
    fontWeight: "500",
  },
  jummahTimes: {
    flexDirection: "row",
    gap: 12,
  },
  jummahTime: {
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  errorText: {
    color: "#d32f2f",
    textAlign: "center",
  },
});
