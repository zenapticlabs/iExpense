import {
  StyleSheet,
  Pressable,
  Modal,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { IReport } from "@/constants/types";
import { formatDate } from "@/utils/UtilFunctions";

interface SubmitConfirmDrawerProps {
  report: IReport;
  isVisible: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function SubmitConfirmDrawer({
  report,
  isVisible,
  onClose,
  onSubmit,
}: SubmitConfirmDrawerProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.deleteModalOverlay} onPress={onClose}>
        <View style={styles.deleteModalContent}>
          <Text style={styles.deleteModalTitle}>
            Are you sure you want to submit this report?
          </Text>

          <View style={styles.deleteModalDetails}>
            <View style={styles.submitDetailsTitleContainer}>
              <Text style={styles.submitDetailsPurposeLabel}>
                {report?.purpose}
              </Text>
              <Text style={styles.submitDetailsNumberLabel}>
                #{report?.report_number}
              </Text>
            </View>
            <Text style={styles.submitDetailsAmountLabel}>
              ${report?.report_amount}
            </Text>
            <View>
              <Text style={styles.submitDetailsDateLabel}>
                Submission: {formatDate(report?.report_submit_date as string)}
              </Text>
              <Text style={styles.submitDetailsDateLabel}>
                Approval: {formatDate(report?.integration_date as string)}
              </Text>
            </View>
          </View>

          <View style={styles.deleteModalButtons}>
            <TouchableOpacity
              style={styles.deleteModalCancelButton}
              onPress={onClose}
            >
              <Text style={styles.deleteModalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.deleteModalConfirmButton,
                { backgroundColor: "#1E3A8A" },
              ]}
              onPress={onSubmit}
            >
              <Text style={styles.deleteModalConfirmText}>Yes, submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  deleteModalContent: {
    backgroundColor: "white",
    padding: 20,
    width: "100%",
  },
  deleteModalTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
  },
  deleteModalDetails: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  deleteModalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  deleteModalCancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  deleteModalConfirmButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#DC2626",
    alignItems: "center",
  },
  deleteModalCancelText: {
    color: "#666",
    fontWeight: "600",
  },
  deleteModalConfirmText: {
    color: "white",
    fontWeight: "600",
  },
  submitDetailsTitleContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 8,
  },
  submitDetailsPurposeLabel: {
    fontSize: 17,
    fontWeight: "600",
  },
  submitDetailsNumberLabel: {
    color: "#5B5B5B",
    fontSize: 13,
    marginLeft: 4,
  },
  submitDetailsAmountLabel: {
    fontSize: 15,
    fontWeight: "400",
    marginBottom: 8,
  },
  submitDetailsDateLabel: {
    fontSize: 13,
    color: "#5B5B5B",
  },
});
