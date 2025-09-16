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

export default function SettingsScreen() {
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const [showMosquePicker, setShowMosquePicker] = useState(false);
  const [tempSelectedSlug, setTempSelectedSlug] = useState("");
  const { selectedMosqueSlug, setSelectedMosque } = useSelectedMosque();
  const selectedMosque = useMosqueBySlug(selectedMosqueSlug);
  const { data: mosqueIndex } = useMosqueIndex();
  const { settings, toggleTheme } = useSettings();
  const { colors } = useAppTheme();

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
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Settings
          </ThemedText>
        </ThemedView>

        <ThemedView style={[styles.section, { backgroundColor: colors.card }]}>
          <ThemedText
            type="subtitle"
            style={[styles.sectionTitle, { color: colors.mosque }]}
          >
            Current Mosque
          </ThemedText>
          {selectedMosque ? (
            <View style={styles.currentMosqueContainer}>
              <ThemedText style={styles.mosqueName}>
                {selectedMosque.name}
              </ThemedText>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.mosque }]}
                onPress={handleChangeMosque}
              >
                <ThemedText
                  style={[styles.buttonText, { color: colors.background }]}
                >
                  Change Mosque
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.currentMosqueContainer}>
              <ThemedText style={styles.noMosqueText}>
                No mosque selected
              </ThemedText>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.mosque }]}
                onPress={handleChangeMosque}
              >
                <ThemedText
                  style={[styles.buttonText, { color: colors.background }]}
                >
                  Select Mosque
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </ThemedView>

        <ThemedView style={[styles.section, { backgroundColor: colors.card }]}>
          <ThemedText
            type="subtitle"
            style={[styles.sectionTitle, { color: colors.mosque }]}
          >
            App Information
          </ThemedText>
          <View style={styles.infoContainer}>
            <ThemedText style={styles.infoText}>
              This app shows prayer times for mosques in Luton, provided by
              InspireFM.
            </ThemedText>
            <ThemedText style={styles.infoText}>
              If your mosque’s times are missing, please contact the mosque so
              they can share the correct times with InspireFM.
            </ThemedText>
          </View>
        </ThemedView>

        <ThemedView style={[styles.section, { backgroundColor: colors.card }]}>
          <ThemedText
            type="subtitle"
            style={[styles.sectionTitle, { color: colors.mosque }]}
          >
            Display Settings
          </ThemedText>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <ThemedText style={[styles.settingTitle, { color: colors.text }]}>
                Dark Mode
              </ThemedText>
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
              trackColor={{
                false: colors.border,
                true: colors.mosque,
              }}
              thumbColor={settings.theme === "dark" ? colors.tint : "#f4f3f4"}
            />
          </View>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    textAlign: "center",
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
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  currentMosqueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mosqueName: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    marginRight: 12,
  },
  noMosqueText: {
    fontSize: 16,
    fontStyle: "italic",
    opacity: 0.7,
    flex: 1,
    marginRight: 12,
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
    color: "#555",
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
  },
  settingSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
});
