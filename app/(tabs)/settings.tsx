import { MosqueSelector } from "@/components/mosque-selector";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BRAND_ORANGE } from "@/constants/theme";
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
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const [showMosqueSelector, setShowMosqueSelector] = useState(false);
  const [showMosquePicker, setShowMosquePicker] = useState(false);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [tempSelectedSlug, setTempSelectedSlug] = useState("");
  const { selectedMosqueSlug, setSelectedMosque } = useSelectedMosque();
  const selectedMosque = useMosqueBySlug(selectedMosqueSlug);
  const { data: mosqueIndex } = useMosqueIndex();
  const { settings, toggleTheme } = useSettings();
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();

  const handleChangeMosque = () => {
    if (selectedMosqueSlug) {
      // Show different modals based on platform
      setTempSelectedSlug(selectedMosqueSlug);
      if (Platform.OS === "ios") {
        setShowMosquePicker(true);
      } else {
        setShowAndroidModal(true);
      }
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

  const handleAndroidModalClose = () => {
    setTempSelectedSlug(selectedMosqueSlug || "");
    setShowAndroidModal(false);
  };

  const handleAndroidMosqueSelect = async (slug: string) => {
    if (slug && slug !== selectedMosqueSlug) {
      try {
        await setSelectedMosque(slug);
        setShowAndroidModal(false);
      } catch {
        Alert.alert(
          "Error",
          "Failed to save mosque selection. Please try again."
        );
      }
    } else {
      setShowAndroidModal(false);
    }
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

      {/* Android Modal */}
      <Modal
        visible={showAndroidModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleAndroidModalClose}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.androidModalContent,
              { backgroundColor: colors.card },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Select Mosque
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleAndroidModalClose}
              >
                <Text
                  style={[styles.closeButtonText, { color: colors.mosque }]}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={availableMosques}
              keyExtractor={(item) => item.slug}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.mosqueItem,
                    {
                      backgroundColor:
                        tempSelectedSlug === item.slug
                          ? colors.mosque + "20"
                          : "transparent",
                      borderBottomColor: colors.border,
                    },
                  ]}
                  onPress={() => setTempSelectedSlug(item.slug)}
                >
                  <Text style={[styles.mosqueItemText, { color: colors.text }]}>
                    {item.name}
                  </Text>
                  {tempSelectedSlug === item.slug && (
                    <Text style={[styles.checkmark, { color: colors.mosque }]}>
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              )}
              style={styles.mosqueList}
            />

            <View style={styles.androidModalFooter}>
              <TouchableOpacity
                style={[
                  styles.androidModalButton,
                  { backgroundColor: colors.border },
                ]}
                onPress={handleAndroidModalClose}
              >
                <Text
                  style={[
                    styles.androidModalButtonText,
                    { color: colors.text },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.androidModalButton,
                  { backgroundColor: colors.mosque },
                ]}
                onPress={() => handleAndroidMosqueSelect(tempSelectedSlug)}
              >
                <Text
                  style={[styles.androidModalButtonText, { color: "#FFF" }]}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
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
                    style={[styles.mosqueName, { color: colors.cardText }]}
                  >
                    {selectedMosque.name}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: BRAND_ORANGE }]}
                  onPress={handleChangeMosque}
                >
                  <ThemedText style={[styles.buttonText, { color: "#000" }]}>
                    Change
                  </ThemedText>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.currentMosqueContainer}>
                <View style={styles.mosqueInfo}>
                  <ThemedText
                    style={[styles.noMosqueText, { color: colors.cardText }]}
                  >
                    No mosque selected
                  </ThemedText>
                </View>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: BRAND_ORANGE }]}
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
              <ThemedText style={[styles.infoText, { color: colors.cardText }]}>
                Prayer times provided by InspireFM.
              </ThemedText>
              <ThemedText style={[styles.infoText, { color: colors.cardText }]}>
                Missing times? Ask your mosque to share data with InspireFM.
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
                <ThemedText
                  style={[styles.settingTitle, { color: colors.cardText }]}
                >
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
    opacity: 0.7,
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
  // Android Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  androidModalContent: {
    borderRadius: 12,
    width: "100%",
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  mosqueList: {
    maxHeight: 400,
  },
  mosqueItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  mosqueItemText: {
    fontSize: 16,
    flex: 1,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  androidModalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    gap: 12,
  },
  androidModalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  androidModalButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
