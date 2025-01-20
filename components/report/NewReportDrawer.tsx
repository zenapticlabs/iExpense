import { ReportTypes, ReportPreferences } from "@/utils/UtilData";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  View,
  Text,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import CurrencyDropdown from "../CurrencyDropdown";
import { ICreateReportPayload } from "@/constants/types";

interface NewReportDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (report: ICreateReportPayload) => void;
}

interface FormData {
  reportType: string;
  purpose: string;
  preference: string;
  currency: string;
}

export default function NewReportDrawer({
  isVisible,
  onClose,
  onSave,
}: NewReportDrawerProps) {
  const [formData, setFormData] = useState<FormData>({
    reportType: "",
    purpose: "",
    preference: ReportPreferences[0].value,
    currency: "usd",
  });

  const updateFormField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.reportType || !formData.purpose) {
      Alert.alert("Error", "Please fill in all required fields");
      return false;
    }
    return true;
  };

  const handleCreateNewReport = async () => {
    if (!validateForm()) return;

    const newReportData: ICreateReportPayload = {
      expense_type: formData.reportType,
      purpose: formData.purpose,
      payment_method: formData.preference,
      report_currency: formData.currency,
      report_amount: 0,
      report_date: new Date().toISOString().split("T")[0],
      error: false,
    };
    onSave(newReportData);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.modalOverlay}
        //   onPress={onClose}
      >
        <View style={styles.newReportDrawer}>
          <View style={styles.drawerTopDivderContainer}>
            <View style={styles.drawerTopDivder} />
          </View>
          <Text style={styles.drawerTitle}>New Report</Text>

          <Text style={styles.inputLabel}>Purpose</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter purpose"
            value={formData.purpose}
            onChangeText={(value) => updateFormField("purpose", value)}
          />

          <Text style={styles.inputLabel}>Report Type</Text>
          <Dropdown
            data={ReportTypes}
            labelField="label"
            valueField="value"
            onChange={(item) => updateFormField("reportType", item.value)}
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
          />

          <Text style={styles.inputLabel}>Date</Text>
          <Pressable style={styles.selectInput}>
            <Text>Nov 5, 2024</Text>
            <Ionicons name="calendar-outline" size={20} color="#64748B" />
          </Pressable>

          <Text style={styles.inputLabel}>Preference</Text>
          <Dropdown
            data={ReportPreferences}
            labelField="label"
            valueField="value"
            value={formData.preference}
            onChange={(item) => updateFormField("preference", item.value)}
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
          />

          <Text style={styles.inputLabel}>Default Currency</Text>
          <CurrencyDropdown
            value={formData.currency}
            onChange={(value) => updateFormField("currency", value)}
          />

          <View style={styles.buttonRow}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={styles.saveButton}
              onPress={handleCreateNewReport}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  newReportDrawer: {
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
  inputLabel: {
    fontSize: 14,
    color: "#1E293B",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  selectInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#F1F5F9",
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#1E3A8A",
  },
  cancelButtonText: {
    color: "#1E293B",
    fontWeight: "500",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "500",
  },
  dropdown: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    width: "100%",
  },
  dropdownContainer: {
    width: "100%",
  },
});
