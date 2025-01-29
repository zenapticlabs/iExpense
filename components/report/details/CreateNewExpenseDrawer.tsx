import {
  StyleSheet,
  Pressable,
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ExpenseType, WarningMessagesByType } from "@/utils/UtilData";
import { useEffect, useState } from "react";
import { reportService } from "@/services/reportService";
import ExtraForms from "./ExpenseTypeComponents/ExtraForms";
import CurrencyDropdown from "@/components/CurrencyDropdown";
import { Styles } from "@/Styles";
import ExpenseForm from "./ExpenseForm";
import DefaultModal from "@/components/DefaultModal";

interface CreateNewExpenseDrawerProps {
  isVisible: boolean;
  reportId: string;
  onClose: () => void;
  onAddExpense: (reportItem: any) => void;
}

const initialPayload = {
  receipt_currency: "usd",
  expense_date: new Date().toISOString().split("T")[0],
  justification: "",
  note: "",
};

export default function CreateNewExpenseDrawer({
  isVisible,
  onClose,
  onAddExpense,
  reportId,
}: CreateNewExpenseDrawerProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [payload, setPayload] = useState<any>(initialPayload);

  const [errors, setErrors] = useState<any>({});

  const handleClose = () => {
    setCurrentStep(1);
    setSearchQuery("");
    setErrors({});
    setPayload(initialPayload);
    onClose();
  };

  const handleAddExpense = async () => {
    try {
      const keys = Object.keys(payload);
      let isValidate = true;
      const newErrors: any = {};
      for (let key of keys) {
        if (payload[key] === "") {
          newErrors[key] = "This field is required";
          isValidate = false;
        }
      }
      setErrors({ ...errors, ...newErrors });
      if (!isValidate) return;

      const { file, ...rest } = payload;

      const prePayload = {
        ...rest,
        filename: payload.file.name,
      };
      const response = await reportService.createReportItem(
        prePayload,
        reportId
      );
      const presigned_url = response.presigned_url;

      await fetch(presigned_url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      onAddExpense(response);
      handleClose();
    } catch (error) {
      console.error("Error creating report item:", error);
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);
  const handleBack = () => {
    setCurrentStep(1);
    setPayload(initialPayload);
    setErrors({});
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.modalTitle}>Create New Expense</Text>
      <Text style={styles.selectExpenseTypeLabel}>Select expense type</Text>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.expenseTypeList}>
        {Object.values(ExpenseType)
          .filter((type) =>
            type.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.expenseTypeItem,
                payload?.expense_type === type && styles.selectedExpenseType,
              ]}
              onPress={() => setPayload({ ...payload, expense_type: type })}
            >
              <Text style={styles.expenseTypeText}>{type}</Text>
              {payload?.expense_type === type && (
                <Ionicons name="checkmark" size={20} color="#1E3A8A" />
              )}
            </TouchableOpacity>
          ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !payload?.expense_type && styles.disabledButton,
          ]}
          onPress={() => payload?.expense_type && setCurrentStep(2)}
          disabled={!payload?.expense_type}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.modalTitle}>Create New Expense</Text>
      {WarningMessagesByType?.[payload?.expense_type] ? ( // Add this block
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            {WarningMessagesByType?.[payload?.expense_type]}
          </Text>
        </View>
      ) : null}

      <ScrollView style={styles.expenseTypeList}>
        <ExpenseForm
          payload={payload}
          setPayload={setPayload}
          errors={errors}
        />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleBack()}
        >
          <Text style={styles.cancelButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleAddExpense}>
          <Text style={styles.nextButtonText}>Add expense</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <DefaultModal isVisible={isVisible} onClose={handleClose}>
      {currentStep === 1 ? renderStep1() : renderStep2()}
    </DefaultModal>
  );
}

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000080",
    zIndex: 99,
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 24,
    alignItems: "flex-start",
    shadowColor: "#000",
    width: "95%",
    zIndex: 99,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalUploadTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1e1e1e",
    lineHeight: 26,
    width: "100%",
    fontFamily: "SFProDisplay",
    paddingBottom: 16,
  },
  uploadContent: {
    height: 262,
    width: "100%",
    backgroundColor: "#DDDDDD",
    borderRadius: 8,
    marginBlock: 10,
  },
  btnsContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    marginTop: 16,
    gap: 16,
    alignItems: "center",
  },

  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 20,
    elevation: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonUpload: {
    backgroundColor: "#17317F",
    color: "white",
  },

  uploadBtnText: {
    color: "white",
  },
  buttonClose: {
    backgroundColor: "#F5F5F5",
    color: "white",
  },
  textStyle: {
    color: "#1E1E1E",
    fontWeight: "500",
    textAlign: "center",
    fontSize: 17,
    fontFamily: "SFProDisplay",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerRight: {
    flexDirection: "row",
    gap: 15,
    marginRight: 8,
  },
  headerLeft: {
    flexDirection: "row",
    marginLeft: 8,
  },
  header: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  id: {
    color: "#666",
  },
  amount: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 8,
  },
  date: {
    color: "#666",
    marginTop: 4,
  },
  approval: {
    color: "#666",
    marginTop: 2,
  },
  submitButton: {
    backgroundColor: "#1a237e",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
  },
  // expenseSection: {
  //   padding: 16,
  //   backgroundColor: "#f5f5f5",
  // },
  // sectionTitle: {
  //   fontSize: 18,
  //   fontWeight: "600",
  //   marginBottom: 16,
  // },
  emptyState: {
    alignItems: "center",
    padding: 32,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginBottom: 16,
    textAlign: "center",
  },
  addButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#000",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingVertical: 8,
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    alignItems: "center",
  },
  tabAddButton: {
    backgroundColor: "#1E3A8A",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  tabText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
  activeTab: {
    color: "#1E3A8A",
  },
  modalContainer: {
    // flex: 1,
    // marginTop: 100,
    backgroundColor: "white",
  },
  modalContent: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "SFProDisplay",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#1E1E1E",
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",

    borderRadius: 8,
    marginBottom: 16,
  },
  searchIcon: {
    position: "absolute",
    left: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 16,
    paddingLeft: 40,
  },
  expenseTypeList: {
    flex: 1,
    gap: 16,
  },
  expenseTypeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    marginBottom: 16,
  },
  selectedExpenseType: {
    backgroundColor: "#EEF2FF",
    borderColor: "#1e3a8a",
  },
  expenseTypeText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    padding: 16,
    flex: 1,
    marginRight: 8,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  nextButton: {
    padding: 16,
    flex: 1,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#1E3A8A",
  },
  disabledButton: {
    backgroundColor: "#A0AEC0",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 17,
    fontFamily: "SFProDisplay",
    fontWeight: "500",
  },
  nextButtonText: {
    color: "white",
    fontSize: 17,
    fontFamily: "SFProDisplay",
    fontWeight: "500",
  },
  selectedTypeContainer: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  currencyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 16,
  },
  currencyPrefix: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 8,
  },
  flagIcon: {
    width: 20,
    height: 15,
    marginRight: 8,
  },
  currencyText: {
    color: "#666",
  },
  currencyInput: {
    flex: 1,
    padding: 16,
  },
  justificationInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  uploadContainer: {
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  uploadText: {
    color: "#666",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  expenseSection: {
    padding: 16,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  expenseItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  expenseItemAmount: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  expenseItemDate: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "red",
    width: 56,
    height: 56,
  },
  saveButton: {
    flex: 1,
    marginLeft: 12,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#1E3A8A",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
  },
  editModalContainer: {
    padding: 16,
    backgroundColor: "white",
  },
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
  openButton: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  openButtonText: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "500",
  },
  statusBadge: {
    backgroundColor: "#F3F4E6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: "#666666",
    fontSize: 14,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 24,
    paddingHorizontal: 0,
  },
  stepperItem: {
    alignItems: "center",
    width: 80,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  activeStep: {
    backgroundColor: "#1E40AF",
  },
  stepNumberText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  activeStepText: {
    color: "white",
  },
  stepLabel: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
    textAlign: "center",
  },
  stepDate: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  stepperLine: {
    width: "20%",
    height: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 12,
  },
  warningContainer: {
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  warningText: {
    fontFamily: "SFProDisplay",
    color: "#DC2626",
    fontSize: 15,
  },
  selectExpenseTypeLabel: {
    fontSize: 20,
    paddingVertical: 20,
  },
  amountContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
});
