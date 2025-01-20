import {
  StyleSheet,
  Pressable,
  Modal,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { IReport } from "@/constants/types";

interface DeleteReportDrawerProps {
  isVisible: boolean;
  report: IReport;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteReportDrawer({
  isVisible,
  onClose,
  onDelete,
  report,
}: DeleteReportDrawerProps) {
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
            Are you sure you want to delete this expense report?
          </Text>

          <View style={styles.deleteModalDetails}>
            <Text style={styles.deleteModalText}>{report?.purpose}</Text>
            <Text style={styles.deleteModalText}>${report?.report_amount}</Text>
            <Text style={styles.deleteModalText}>
              {report?.report_submit_date}
            </Text>
          </View>

          <View style={styles.deleteModalButtons}>
            <TouchableOpacity
              style={styles.deleteModalCancelButton}
              onPress={onClose}
            >
              <Text style={styles.deleteModalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteModalConfirmButton}
              onPress={onDelete}
            >
              <Text style={styles.deleteModalConfirmText}>Yes, delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  deleteModalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 20,
    width: "100%",
  },
  deleteModalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  deleteModalDetails: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  deleteModalText: {
    fontSize: 16,
    marginBottom: 4,
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
});
