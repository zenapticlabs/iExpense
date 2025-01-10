import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Modal,
} from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { IExpense } from "@/constants/types";
import { mockReports } from "@/constants/mockData";
import Stepper from "@/components/Stepper";

const EXPENSE_TYPES = [
  "Airfare",
  "Airline Club Membership Dues",
  "Airline Fees",
  "Auto Rental",
  "Automobile",
  "Business Meals",
  "Company Sponsor - CDFO",
];

export default function ExpenseDetails() {
  const { id } = useLocalSearchParams();
  const report = mockReports.find((report) => report.id === id);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedExpenseType, setSelectedExpenseType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpense, setSelectedExpense] = useState<IExpense | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isUploadFileModalVisible, setUploadFileModalVisible] = useState(false);
  const [isReportDeleteModalVisible, setIsReportDeleteModalVisible] =
    useState(false);
  const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);

  const expenses = [
    {
      title: "International Travel",
      amount: "120.00",
      date: "Nov 5, 2024",
    },
    {
      title: "International Travel",
      amount: "80.00",
      date: "Nov 5, 2024",
    },
    {
      title: "International Travel",
      amount: "140.00",
      date: "Nov 5, 2024",
    },
  ];

  const handleNext = () => {
    if (selectedExpenseType) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setCurrentStep(1);
    setSelectedExpenseType("");
    setSearchQuery("");
  };

  const handleCloseExpenseDetail = () => {
    setSelectedExpense(null);
  };

  const handleExpensePress = (expense: IExpense) => {
    setSelectedExpense(expense);
  };

  const handleDeletePress = () => {
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleteModalVisible(false);
    handleCloseExpenseDetail();
  };

  const handleReportDelete = () => {
    setIsReportDeleteModalVisible(false);
    router.back();
  };

  const handleSubmit = () => {
    setIsSubmitModalVisible(false);
    console.log("Report submitted");
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.modalTitle}>Create New Expense</Text>
      <Text style={styles.label}>Select expense type</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.expenseTypeList}>
        {EXPENSE_TYPES.filter((type) =>
          type.toLowerCase().includes(searchQuery.toLowerCase())
        ).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.expenseTypeItem,
              selectedExpenseType === type && styles.selectedExpenseType,
            ]}
            onPress={() => setSelectedExpenseType(type)}
          >
            <Text style={styles.expenseTypeText}>{type}</Text>
            {selectedExpenseType === type && (
              <Ionicons name="checkmark" size={24} color="#1E3A8A" />
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
            !selectedExpenseType && styles.disabledButton,
          ]}
          onPress={handleNext}
          disabled={!selectedExpenseType}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.modalTitle}>Create New Expense</Text>
      <Text style={styles.label}>Expense type</Text>
      <View style={styles.selectedTypeContainer}>
        <Text>{selectedExpenseType}</Text>
      </View>

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity style={styles.inputContainer}>
        <Text>Nov 5, 2024</Text>
        <Ionicons name="calendar-outline" size={20} color="#666" />
      </TouchableOpacity>

      <Text style={styles.label}>Receipt amount</Text>
      <View style={styles.currencyInputContainer}>
        <View style={styles.currencyPrefix}>
          {/* <Image
            source={require("../../assets/us-flag.png")}
            style={styles.flagIcon}
          /> */}
          <Text style={styles.currencyText}>USD $</Text>
        </View>
        <TextInput
          style={styles.currencyInput}
          placeholder="0.00"
          keyboardType="decimal-pad"
        />
      </View>

      <Text style={styles.label}>Converted report amount</Text>
      <View style={styles.currencyInputContainer}>
        <View style={styles.currencyPrefix}>
          {/* <Image
            source={require("../../assets/us-flag.png")}
            style={styles.flagIcon}
          /> */}
          <Text style={styles.currencyText}>USD $</Text>
        </View>
        <TextInput
          style={styles.currencyInput}
          placeholder="0.00"
          keyboardType="decimal-pad"
        />
      </View>

      <Text style={styles.label}>Justification</Text>
      <TextInput
        style={styles.justificationInput}
        placeholder="Enter justification"
        multiline={true}
        numberOfLines={3}
      />

      <Text style={styles.label}>Attached receipt</Text>
      <TouchableOpacity style={styles.uploadContainer}>
        <Ionicons name="cloud-upload-outline" size={24} color="#666" />
        <Text style={styles.uploadText}>Upload file</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
          <Text style={styles.cancelButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleClose}>
          <Text style={styles.nextButtonText}>Add expense</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={36} color="#000" />
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <Ionicons name="add" size={36} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsReportDeleteModalVisible(true)}
              >
                <Ionicons name="trash-outline" size={36} color="#000" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{report?.title}</Text>
            <Text style={styles.id}>#{report?.id}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{report?.state}</Text>
          </View>
        </View>
        <Text style={styles.amount}>${report?.amount.toFixed(2)}</Text>
        <Text style={styles.date}>Submission: {report?.submission}</Text>
        <Text style={styles.approval}>Approval: {report?.approval}</Text>

        {/* <View style={styles.stepper}>
          <View style={styles.stepperItem}>
            <View style={[styles.stepNumber, styles.activeStep]}>
              <Text style={[styles.stepNumberText, styles.activeStepText]}>
                1
              </Text>
            </View>
            <Text style={styles.stepLabel}>Submitted</Text>
            <Text style={styles.stepDate}>Nov 5</Text>
          </View>

          <View style={styles.stepperLine} />

          <View style={styles.stepperItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepLabel}>Approved</Text>
          </View>

          <View style={styles.stepperLine} />

          <View style={styles.stepperItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepLabel}>Paid</Text>
          </View>
        </View> */}
        <Stepper currentState={report?.state} date={report?.submission} />
      </View>

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit Report</Text>
      </TouchableOpacity>

      {/* <View style={styles.expenseSection}>
        <Text style={styles.sectionTitle}>Expense Items</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyText}>No expenses</Text>
          <Text style={styles.emptySubtext}>
            Tap the "+" button and start adding expenses
          </Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>Add expense</Text>
          </TouchableOpacity>
        </View>
      </View> */}
      <View style={styles.expenseSection}>
        <Text style={styles.sectionTitle}>Expense Items</Text>
        {expenses.map((expense) => (
          <TouchableOpacity
            key={expense.amount}
            style={styles.expenseItem}
            onPress={() => handleExpensePress(expense)}
          >
            <View>
              <Text style={styles.expenseItemTitle}>{expense.title}</Text>
              <Text style={styles.expenseItemAmount}>${expense.amount}</Text>
              <Text style={styles.expenseItemDate}>{expense.date}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.tabBar}>
        <View style={[styles.tabItem]}>
          <Ionicons name="document-text" size={24} color="#1E3A8A" />
          <Text style={styles.tabText}>Reports</Text>
        </View>
        <View style={styles.tabItem}>
          <Pressable
            style={styles.tabAddButton}
            // onPress={() => setIsNewReportDrawerVisible(true)}
            onPress={() => console.log(true)}
          >
            <Ionicons name="add" size={24} color="white" />
          </Pressable>
        </View>
        <View style={styles.tabItem}>
          <Ionicons name="person-outline" size={24} color="#64748B" />
          <Text style={styles.tabText}>My Profile</Text>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleClose}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {currentStep === 1 ? renderStep1() : renderStep2()}
            </View>
          </View>
        </Pressable>
      </Modal>

      <Modal
          animationType="slide"
          transparent={true}
          visible={isUploadFileModalVisible}
          onRequestClose={()=> setUploadFileModalVisible(!isUploadFileModalVisible)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Uploaded receipt</Text>
              <View style={styles.uploadContent}></View>
              <View style={styles.btnsContainer}>
              <Pressable
                style={[styles.button, styles.buttonUpload]}
                // onPress={() => setModalVisible(!modalVisible)}
                >
                <Text style={styles.textStyle , styles.uploadBtnText}>Upload receipt</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setUploadFileModalVisible(false)}
                >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              </View>
            </View>
          </View>
        </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedExpense !== null}
        onRequestClose={handleCloseExpenseDetail}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={handleCloseExpenseDetail}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.editModalContainer}>
                <Text style={styles.modalTitle}>Edit Expense</Text>

                {selectedExpense && (
                  <>
                    <Text style={styles.label}>Expense type</Text>
                    <View style={styles.selectedTypeContainer}>
                      <Text>{selectedExpense.title}</Text>
                    </View>

                    <Text style={styles.label}>Date</Text>
                    <TouchableOpacity style={styles.inputContainer}>
                      <Text>{selectedExpense.date}</Text>
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>

                    <Text style={styles.label}>Receipt amount</Text>
                    <View style={styles.currencyInputContainer}>
                      <View style={styles.currencyPrefix}>
                        {/* <Image
                      source={require("../../assets/us-flag.png")}
                      style={styles.flagIcon}
                    /> */}
                        <Text style={styles.currencyText}>USD $</Text>
                      </View>
                      <TextInput
                        style={styles.currencyInput}
                        defaultValue={selectedExpense.amount}
                        keyboardType="decimal-pad"
                      />
                    </View>

                    <Text style={styles.label}>Converted report amount</Text>
                    <View style={styles.currencyInputContainer}>
                      <View style={styles.currencyPrefix}>
                        {/* <Image
                      source={require("../../assets/us-flag.png")}
                      style={styles.flagIcon}
                    /> */}
                        <Text style={styles.currencyText}>USD $</Text>
                      </View>
                      <TextInput
                        style={styles.currencyInput}
                        defaultValue={selectedExpense.amount}
                        keyboardType="decimal-pad"
                      />
                    </View>

                    <Text style={styles.label}>Justification</Text>
                    <TextInput
                      style={styles.justificationInput}
                      placeholder="Enter justification"
                      multiline={true}
                      numberOfLines={3}
                    />

                    <Text style={styles.label}>Attached receipt</Text>
                    <TouchableOpacity style={styles.uploadContainer} onPress={()=> setUploadFileModalVisible(true)}>
                      <Ionicons
                        name="cloud-upload-outline"
                        size={24}
                        color="#666"
                      />
                      <Text style={styles.uploadText}>Upload file</Text>
                    </TouchableOpacity>

                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDeletePress}
                      >
                        <Ionicons name="trash-outline" size={24} color="red" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleCloseExpenseDetail}
                      >
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <Pressable
          style={styles.deleteModalOverlay}
          onPress={() => setIsDeleteModalVisible(false)}
        >
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>
              Are you sure you want to delete this expense item?
            </Text>

            <View style={styles.deleteModalDetails}>
              <Text style={styles.deleteModalText}>
                {selectedExpense?.title}
              </Text>
              <Text style={styles.deleteModalText}>
                ${selectedExpense?.amount}
              </Text>
              <Text style={styles.deleteModalText}>
                {selectedExpense?.date}
              </Text>
            </View>

            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={styles.deleteModalCancelButton}
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <Text style={styles.deleteModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteModalConfirmButton}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.deleteModalConfirmText}>Yes, delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isReportDeleteModalVisible}
        onRequestClose={() => setIsReportDeleteModalVisible(false)}
      >
        <Pressable
          style={styles.deleteModalOverlay}
          onPress={() => setIsReportDeleteModalVisible(false)}
        >
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>
              Are you sure you want to delete this expense report?
            </Text>

            <View style={styles.deleteModalDetails}>
              <Text style={styles.deleteModalText}>Airline Fees</Text>
              <Text style={styles.deleteModalText}>$120.00</Text>
              <Text style={styles.deleteModalText}>Nov 5, 2024</Text>
            </View>

            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={styles.deleteModalCancelButton}
                onPress={() => setIsReportDeleteModalVisible(false)}
              >
                <Text style={styles.deleteModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteModalConfirmButton}
                onPress={handleReportDelete}
              >
                <Text style={styles.deleteModalConfirmText}>Yes, delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isSubmitModalVisible}
        onRequestClose={() => setIsSubmitModalVisible(false)}
      >
        <Pressable
          style={styles.deleteModalOverlay}
          onPress={() => setIsSubmitModalVisible(false)}
        >
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>
              Are you sure you want to submit this report?
            </Text>

            <View style={styles.deleteModalDetails}>
              <Text style={styles.deleteModalText}>
                International Travel #1001
              </Text>
              <Text style={styles.deleteModalText}>$120.00</Text>
              <Text style={styles.deleteModalText}>Nov 5, 2024</Text>
            </View>

            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={styles.deleteModalCancelButton}
                onPress={() => setIsSubmitModalVisible(false)}
              >
                <Text style={styles.deleteModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.deleteModalConfirmButton,
                  { backgroundColor: "#1E3A8A" },
                ]}
                onPress={handleSubmit}
              >
                <Text style={styles.deleteModalConfirmText}>Yes, submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#00000080',
    zIndex:99,
    position:'absolute',
    height: '100vh',
    width :'100%'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    alignItems: 'flex-start',
    shadowColor: '#000',
    width:'95%',
    zIndex:99,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle:{
   fontSize: 22,
    fontWeight: 700,
    color: '#1e1e1e',
    lineHeight: 26,
    width: '100%',
  },
  uploadContent :{
    height: 262,
    width:'100%',
    backgroundColor:'#DDDDDD',
    borderRadius:8,
    marginBlock: 10,
  },  
  btnsContainer :{
    display:'flex',
    justifyContent:'space-between',
    flexDirection:'row',
    width:'100%',
    height:88,
    alignItems:'center',
  },

  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    width:'49%',
    height:56,
  },
  
  buttonUpload: {
    backgroundColor: '#F5F5F5',
    color:'#000',
  }, 

  uploadBtnText:{
    color:'#000',
  },
  buttonClose: {
    backgroundColor: '#17317F',
    color:'white',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
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
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  expenseTypeList: {
    flex: 1,
  },
  expenseTypeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedExpenseType: {
    backgroundColor: "#EEF2FF",
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
    fontWeight: "600",
  },
  nextButtonText: {
    color: "white",
    fontWeight: "600",
  },
  selectedTypeContainer: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 16,
  },
  currencyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
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
    padding: 16,
    marginBottom: 16,
    height: 100,
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
});
