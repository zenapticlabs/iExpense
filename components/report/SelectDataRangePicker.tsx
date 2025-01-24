import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Pressable, Modal, View, Text } from "react-native";
interface SelectDataRangePickerProps {
  onChange: (dateRange: string) => void;
  value: string;
}

interface IDateOption {
  label: string;
  value: string;
}

export const DATE_OPTIONS: IDateOption[] = [
  { label: "Last 3 months", value: "last_3_months" },
  { label: "Last 6 months", value: "last_6_months" },
  { label: "This year", value: "this_year" },
  { label: "Last year", value: "last_year" },
];

export default function SelectDataRangePicker({
  onChange,
  value,
}: SelectDataRangePickerProps) {
  const [isVisible, setIsVisible] =
    useState(false);
  return (
    <>
      <Pressable
        style={styles.filterButton}
        onPress={() => setIsVisible(true)}
      >
        <Ionicons name="calendar-clear-outline" size={20} color="#5B5B5B" />
        <Text style={styles.filterText}>This month</Text>
      </Pressable>

      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.SelectDataRangePicker}>
            <View style={styles.drawerTopDivderContainer}>
              <View style={styles.drawerTopDivder}></View>
            </View>
            <Text style={styles.drawerTitle}>Select Date Range</Text>
            {DATE_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.dateOption,
                  value === option.value && styles.selectedOption,
                ]}
                onPress={() => onChange(option.value)}
              >
                <Text>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  SelectDataRangePicker: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  drawerTopDivderContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  drawerTopDivder: {
    height: 6,
    width: 32,
    backgroundColor: "#DDDDDD",
    borderRadius: 4,
  },
  dateOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  selectedOption: {
    backgroundColor: "#17317F1A",
    borderColor: "#17317F",
  },
  filterText: {
    color: "#5B5B5B",
    fontSize: 13,
    fontFamily: "SFProDisplay",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderColor: "#E2E8F0",
    borderRadius: 50,
    gap: 4,
  },
});
