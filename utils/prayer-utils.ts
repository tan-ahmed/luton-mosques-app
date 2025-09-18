// Prayer time formatting and status utilities

/**
 * Formats a time string into a readable format
 * @param time - Time string in HH:MM or HH:MM:SS format
 * @param displaySeconds - Whether to include seconds in the output
 * @param is24Hour - Whether to use 24-hour format (true) or 12-hour format with AM/PM (false)
 * @returns Formatted time string or "-" if invalid
 * @example
 * formatTime("13:30", false, true) // "13:30"
 * formatTime("13:30", false, false) // "1:30 PM"
 * formatTime("13:30:45", true, true) // "13:30:45"
 */
export const formatTime = (
  time: string | undefined,
  displaySeconds: boolean = false,
  is24Hour: boolean = false
): string => {
  if (!time) return "-";

  const [hours, minutes, seconds] = String(time).split(":").map(Number);

  if (isNaN(hours) || isNaN(minutes)) {
    return "-";
  }

  let hour = hours;
  if (!is24Hour) {
    hour = hours % 12 || 12;
  }

  let string = `${hour.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  if (displaySeconds && !isNaN(seconds)) {
    string += `:${seconds.toString().padStart(2, "0")}`;
  }

  if (!is24Hour) {
    string += ` ${hours >= 12 ? "PM" : "AM"}`;
  }

  return string;
};

/**
 * Formats a date string from DD-MM-YYYY format to a readable long format
 * @param dateString - Date string in DD-MM-YYYY format
 * @returns Formatted date string (e.g., "Monday, 15 January 2024") or original string if parsing fails
 * @example
 * formatDate("15-01-2024") // "Monday, 15 January 2024"
 */
export const formatDate = (dateString: string): string => {
  try {
    // Parse DD-MM-YYYY format
    const [day, month, year] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString; // Return original if parsing fails
  }
};

/**
 * Formats a date string from DD-MM-YYYY format to a short readable format
 * @param dateString - Date string in DD-MM-YYYY format
 * @returns Formatted date string (e.g., "Mon, 15 Jan") or original string if parsing fails
 * @example
 * formatDateShort("15-01-2024") // "Mon, 15 Jan"
 */
export const formatDateShort = (dateString: string): string => {
  try {
    const [day, month, year] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  } catch {
    return dateString;
  }
};

/**
 * Prayer status information
 */
export interface PrayerStatus {
  /** Current status of the prayer */
  status: "upcoming" | "current" | "ending" | "passed";
  /** Text color for the prayer */
  color: string;
  /** Background color for the prayer */
  backgroundColor: string;
  /** Display label for the status */
  label: string;
}

/**
 * Determines the current status of a prayer based on the current time
 * @param prayerTime - Time string in HH:MM format
 * @param nextPrayerTime - Optional next prayer time for determining current prayer period
 * @returns PrayerStatus object with status, colors, and label
 * @example
 * getPrayerStatus("13:30", "16:00") // Returns status based on current time
 */
export const getPrayerStatus = (
  prayerTime: string,
  nextPrayerTime?: string
): PrayerStatus => {
  const currentTime = new Date();
  const currentUnix = currentTime.getTime();

  // Parse prayer time for today
  const [hours, minutes] = prayerTime.split(":").map(Number);
  const prayerUnix = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate(),
    hours,
    minutes
  ).getTime();

  // Parse next prayer time if available
  let nextPrayerUnix = 0;
  if (nextPrayerTime) {
    const [nextHours, nextMinutes] = nextPrayerTime.split(":").map(Number);
    nextPrayerUnix = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      nextHours,
      nextMinutes
    ).getTime();

    // If next prayer is earlier in the day, it's tomorrow
    if (nextPrayerUnix <= prayerUnix) {
      nextPrayerUnix += 24 * 60 * 60 * 1000; // Add 24 hours
    }
  }

  // Determine status
  if (currentUnix < prayerUnix - 15 * 60000) {
    // More than 15 minutes before prayer
    return {
      status: "upcoming",
      color: "#666666",
      backgroundColor: "transparent",
      label: "Upcoming",
    };
  } else if (currentUnix < prayerUnix) {
    // Within 15 minutes before prayer
    return {
      status: "current",
      color: "#FFD700",
      backgroundColor: "#3f51b5",
      label: "Soon",
    };
  } else if (nextPrayerTime && currentUnix < nextPrayerUnix) {
    // Between this prayer and next prayer
    return {
      status: "current",
      color: "#FFD700",
      backgroundColor: "#2e7d32",
      label: "Current",
    };
  } else {
    // Prayer has passed
    return {
      status: "passed",
      color: "#999999",
      backgroundColor: "transparent",
      label: "Passed",
    };
  }
};

/**
 * Calculates the time remaining until the next prayer
 * @param prayerTime - Time string in HH:MM format
 * @returns Formatted time string (e.g., "2h 30m" or "45m")
 * @example
 * getTimeUntilNext("14:30") // "2h 30m" (if current time is 12:00)
 * getTimeUntilNext("13:45") // "45m" (if current time is 13:00)
 */
export const getTimeUntilNext = (prayerTime: string): string => {
  const currentTime = new Date();
  const [hours, minutes] = prayerTime.split(":").map(Number);

  let prayerDate = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate(),
    hours,
    minutes
  );

  // If prayer time has passed today, check tomorrow
  if (prayerDate.getTime() <= currentTime.getTime()) {
    prayerDate.setDate(prayerDate.getDate() + 1);
  }

  const diffMs = prayerDate.getTime() - currentTime.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m`;
  } else {
    return `${diffMinutes}m`;
  }
};
