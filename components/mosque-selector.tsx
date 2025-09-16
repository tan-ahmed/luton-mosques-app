import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useMosqueIndex } from "@/hooks/use-mosque-data";
import { useAppTheme, useSelectedMosque } from "@/stores/app-store";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MosqueSelectorProps {
  onMosqueSelected?: () => void;
}

export function MosqueSelector({ onMosqueSelected }: MosqueSelectorProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [selectedMosqueName, setSelectedMosqueName] =
    useState<string>("Choose a mosque...");
  const [modalVisible, setModalVisible] = useState(false);
  const { data: mosqueIndex, isLoading, error } = useMosqueIndex();
  const { setSelectedMosque } = useSelectedMosque();
  const { colors } = useAppTheme();

  const handleMosqueSelect = async (slug: string, name: string) => {
    if (!slug) return;

    try {
      setSelectedSlug(slug);
      setSelectedMosqueName(name);
      setModalVisible(false);
      await setSelectedMosque(slug);
      onMosqueSelected?.();
    } catch {
      Alert.alert(
        "Error",
        "Failed to save mosque selection. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.loadingText}>Loading mosques...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>
          Failed to load mosque list. Please check your internet connection.
        </ThemedText>
      </ThemedView>
    );
  }

  if (!mosqueIndex?.mosques?.length) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.errorText}>No mosques found.</ThemedText>
      </ThemedView>
    );
  }

  // Filter mosques that have data
  const availableMosques = mosqueIndex.mosques.filter(
    (mosque) => mosque.hasData
  );

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.mosque }]}>
          Assalāmu&apos; Alaykum
        </Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Thank you for using the Luton Mosques app. Please select your
          preferred mosque.
        </Text>
      </View>

      <View style={styles.pickerContainer}>
        <ThemedText style={[styles.label, { color: colors.mosque }]}>
          Select Mosque:
        </ThemedText>
        <TouchableOpacity
          style={[
            styles.pickerWrapper,
            {
              borderColor: colors.border,
              backgroundColor: colors.card,
            },
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Text
            style={[
              styles.pickerText,
              { color: selectedSlug ? colors.text : colors.text + "80" },
            ]}
          >
            {selectedMosqueName}
          </Text>
          <Text style={[styles.dropdownArrow, { color: colors.text }]}>▼</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Select Mosque
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
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
                        selectedSlug === item.slug
                          ? colors.mosque + "20"
                          : "transparent",
                      borderBottomColor: colors.border,
                    },
                  ]}
                  onPress={() => handleMosqueSelect(item.slug, item.name)}
                >
                  <Text style={[styles.mosqueItemText, { color: colors.text }]}>
                    {item.name}
                  </Text>
                  {selectedSlug === item.slug && (
                    <Text style={[styles.checkmark, { color: colors.mosque }]}>
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              )}
              style={styles.mosqueList}
            />
          </View>
        </View>
      </Modal>

      {availableMosques.length !== mosqueIndex.mosques.length && (
        <ThemedText style={styles.note}>
          Note: Some mosques may not have current prayer time data available.
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  pickerContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  pickerText: {
    fontSize: 16,
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    marginLeft: 8,
  },
  note: {
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
    opacity: 0.7,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "#d32f2f", // Keep error color as red
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
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
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
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
});
