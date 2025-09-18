import { MosqueSelector } from "@/components/mosque-selector";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useMosqueBySlug, useMosqueIndex } from "@/hooks/use-mosque-data";
import {
  useAppTheme,
  useSelectedMosque,
  useSettings,
} from "@/stores/app-store";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const [showMosquePicker, setShowMosquePicker] = useState(false);
  const [tempSelectedSlug, setTempSelectedSlug] = useState("");
  const { selectedMosqueSlug, setSelectedMosque } = useSelectedMosque();
  const selectedMosque = useMosqueBySlug(selectedMosqueSlug);
  const { data: mosqueIndex } = useMosqueIndex();
  const { settings, toggleTheme } = useSettings();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  const handleChangeMosque = () => {
    if (selectedMosqueSlug) {
      // Show picker modal for existing users
      setTempSelectedSlug(selectedMosqueSlug);
      setShowMosquePicker(true);
    } else {
      // Show full mosque selector for first-time users
      setShowMosqueSelector(true);
    }
  };

  const handleMosqueSelected = () => {
    setShowMosqueSelector(false);
  };

  const handlePickerSave = async () => {
    if (tempSelectedSlug && tempSelectedSlug !== selectedMosqueSlug) {
      try {
        await setSelectedMosque(tempSelectedSlug);
        setShowMosquePicker(false);
      } catch {
        Alert.alert(
          "Error",
          "Failed to save mosque selection. Please try again."
        );
      }
    } else {
      setShowMosquePicker(false);
    }
  };

  const handlePickerCancel = () => {
    setTempSelectedSlug(selectedMosqueSlug || "");
    setShowMosquePicker(false);
  };

  if (showMosqueSelector) {
    return <MosqueSelector onMosqueSelected={handleMosqueSelected} />;
  }

  const availableMosques =
    mosqueIndex?.mosques.filter((mosque) => mosque.hasData) || [];

  return (
    <>
      <Modal
        visible={showMosquePicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handlePickerCancel}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <ThemedView
            style={[styles.modalHeader, { backgroundColor: colors.card }]}
          >
            <TouchableOpacity onPress={handlePickerCancel}>
              <ThemedText style={[styles.modalButton, { color: colors.text }]}>
                Cancel
              </ThemedText>
            </TouchableOpacity>
            <ThemedText style={[styles.modalTitle, { color: colors.mosque }]}>
              Select Mosque
            </ThemedText>
            <TouchableOpacity onPress={handlePickerSave}>
              <ThemedText style={[styles.modalButton, { color: colors.tint }]}>
                Save
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tempSelectedSlug}
              onValueChange={(itemValue) => setTempSelectedSlug(itemValue)}
              style={[styles.picker, { color: colors.text }]}
            >
              {availableMosques.map((mosque) => (
                <Picker.Item
                  key={mosque.slug}
                  label={mosque.name}
                  value={mosque.slug}
                  color={colors.text}
                />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>

      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <ThemedView style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <ThemedText style={styles.title}>Settings</ThemedText>
        </ThemedView>

        <View style={styles.sectionContainer}>
          <View
            style={[
              styles.section,
              {
                borderColor: colors.border,
                borderWidth: 1,
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
                Current Mosque
              </ThemedText>
            </View>
            {selectedMosque ? (
              <View style={styles.currentMosqueContainer}>
                <View style={styles.mosqueInfo}>
                  <ThemedText
                    style={[styles.mosqueName, { color: colors.text }]}
                  >
                    {selectedMosque.name}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#FF8F70" }]}
                  onPress={handleChangeMosque}
                >
                  <ThemedText style={[styles.buttonText, { color: "#FFF" }]}>
                    Change
                  </ThemedText>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.currentMosqueContainer}>
                <View style={styles.mosqueInfo}>
                  <ThemedText
                    style={[
                      styles.noMosqueText,
                      { color: colors.text, opacity: 0.7 },
                    ]}
                  >
                    No mosque selected
                  </ThemedText>
                </View>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#FF8F70" }]}
                  onPress={handleChangeMosque}
                >
                  <ThemedText style={[styles.buttonText, { color: "#FFF" }]}>
                    Select
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View
            style={[
              styles.section,
              {
                borderColor: colors.border,
                borderWidth: 1,
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
                App Information
              </ThemedText>
            </View>
            <View style={styles.infoContainer}>
              <ThemedText style={styles.infoText}>
                This app shows prayer times for mosques in Luton, provided by
                InspireFM.
              </ThemedText>
              <ThemedText style={styles.infoText}>
                If your mosque's times are missing, please contact the mosque so
                they can share the correct times with InspireFM.
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View
            style={[
              styles.section,
              {
                borderColor: colors.border,
                borderWidth: 1,
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
                Display Settings
              </ThemedText>
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <ThemedText style={styles.settingTitle}>Dark Mode</ThemedText>
                <ThemedText
                  style={[
                    styles.settingSubtitle,
                    { color: colors.text, opacity: 0.7 },
                  ]}
                >
                  {settings.theme === "dark"
                    ? "Use dark theme"
                    : "Use light theme"}
                </ThemedText>
              </View>
              <Switch
                value={settings.theme === "dark"}
                onValueChange={toggleTheme}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalButton: {
    fontSize: 16,
    fontWeight: "500",
  },
  pickerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  picker: {
    height: 200,
  },
  section: {
    borderRadius: 8,
    padding: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  currentMosqueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mosqueInfo: {
    flex: 1,
    marginRight: 12,
  },
  mosqueName: {
    fontSize: 16,
    fontWeight: "500",
  },
  noMosqueText: {
    fontSize: 16,
    fontStyle: "italic",
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 14,
  },
  infoContainer: {
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "white",
  },
  dataSource: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  link: {
    color: "#2c5f41",
    textDecorationLine: "underline",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  settingLeft: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
    color: "white",
  },
  settingSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
});
