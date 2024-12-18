import { StyleSheet, Pressable, Image, Modal, TextInput } from "react-native";
import { Link, useRouter } from "expo-router";
import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ReportStatusBgColor, ReportStatusTextColor } from "@/utils/UtilData";
import { SelectList } from "react-native-dropdown-select-list";
type ExpenseReport = {
  title: string;
  id: string;
  submission: string | null;
  approval: string | null;
  state: "submitted" | "approved" | "paid";
  amount: number;
};

const DATE_OPTIONS = [
  { label: "Last 3 months", value: "last_3_months" },
  { label: "Last 6 months", value: "last_6_months" },
  { label: "This year", value: "this_year" },
  { label: "Last year", value: "last_year" },
];

const EXPENSE_DATA: ExpenseReport[] = [
  {
    title: "International Travel",
    id: "#1001",
    submission: "Nov 5, 2024",
    approval: null,
    state: "submitted",
    amount: 120.0,
  },
  {
    title: "Meals",
    id: "#1001",
    submission: null,
    approval: null,
    state: "approved",
    amount: 120.0,
  },
  {
    title: "Automobile",
    id: "#1001",
    submission: null,
    approval: null,
    state: "paid",
    amount: 120.0,
  },
  {
    title: "Airfare",
    id: "#1001",
    submission: "Nov 5, 2024",
    approval: null,
    state: "submitted",
    amount: 120.0,
  },
];

const ExpenseItem = ({
  expense,
  onPress,
}: {
  expense: ExpenseReport;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress} style={styles.expenseItem}>
    <View>
      <View style={styles.titleRow}>
        <Text style={styles.expenseTitle}>{expense.title}</Text>
        <Text style={styles.expenseId}>{expense.id}</Text>
      </View>
      <Text style={styles.expenseAmount}>${expense.amount.toFixed(2)}</Text>
      <View style={styles.expenseDetails}>
        <Text style={styles.detailText}>
          Submission: {expense.submission || "N/A"}
        </Text>
        <Text style={styles.detailText}>
          Approval: {expense.approval || "N/A"}
        </Text>
      </View>
    </View>
    <View
      style={[
        styles.statusBadge,
        { backgroundColor: ReportStatusBgColor(expense.state) },
      ]}
    >
      <Text
        style={[
          styles.statusText,
          { color: ReportStatusTextColor(expense.state) },
        ]}
      >
        {expense.state.charAt(0).toUpperCase() + expense.state.slice(1)}
      </Text>
    </View>
  </Pressable>
);

export default function ExpenseScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [selectedReportType, setSelectedReportType] = useState("");
  const data = [
    { key: "1", value: "Mobiles", disabled: true },
    { key: "2", value: "Appliances" },
    { key: "3", value: "Cameras" },
    { key: "4", value: "Computers", disabled: true },
    { key: "5", value: "Vegetables" },
    { key: "6", value: "Diary Products" },
    { key: "7", value: "Drinks" },
  ];
  const [selectedDateRange, setSelectedDateRange] = useState(DATE_OPTIONS[0]);
  const [isDateRangeDrawerVisible, setIsDateRangeDrawerVisible] =
    useState(false);
  const [isNewReportDrawerVisible, setIsNewReportDrawerVisible] =
    useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/brand.png")}
          style={styles.logo}
        />
        <Text style={styles.userName}>James Stewart</Text>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.title}>Expense Reports</Text>
        <Pressable style={styles.filterButton}>
          <Ionicons name="calendar-outline" size={20} color="#64748B" />
          <Text
            onPress={() => setIsDateRangeDrawerVisible(true)}
            style={styles.filterText}
          >
            This month
          </Text>
        </Pressable>
      </View>

      <View style={styles.expenseList}>
        {EXPENSE_DATA.map((expense, index) => (
          <ExpenseItem
            key={`${expense.id}-${index}`}
            expense={expense}
            onPress={() => router.push("/expense/details")}
          />
        ))}
      </View>
      <View style={styles.tabBar}>
        <View style={[styles.tabItem]}>
          <Ionicons name="document-text" size={24} color="#1E3A8A" />
          <Text style={styles.tabText}>Reports</Text>
        </View>
        <View style={styles.tabItem}>
          <Pressable
            style={styles.addButton}
            onPress={() => setIsNewReportDrawerVisible(true)}
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
        visible={isDateRangeDrawerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsDateRangeDrawerVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsDateRangeDrawerVisible(false)}
        >
          <View style={styles.drawer}>
            <View style={styles.drawerTopDivderContainer}>
              <View style={styles.drawerTopDivder}></View>
            </View>
            <Text style={styles.drawerTitle}>Select Date Range</Text>
            {DATE_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.dateOption,
                  selectedDateRange === option && styles.selectedOption,
                ]}
                onPress={() => setSelectedDateRange(option)}
              >
                <Text>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
      <Modal
        visible={isNewReportDrawerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsNewReportDrawerVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          // onPress={() => setIsNewReportDrawerVisible(false)}
        >
          <View style={styles.newReportDrawer}>
            <View style={styles.drawerTopDivderContainer}>
              <View style={styles.drawerTopDivder}></View>
            </View>
            <Text style={styles.drawerTitle}>New Report</Text>

            <Text style={styles.inputLabel}>Purpose</Text>
            <TextInput style={styles.input} placeholder="example" />

            <Text style={styles.inputLabel}>Report Type</Text>
            <SelectList
              setSelected={(val: any) => setSelected(val)}
              data={data}
              save="value"
            />
            <Text style={styles.inputLabel}>Date</Text>
            <Pressable style={styles.selectInput}>
              <Text>Nov 5, 2024</Text>
              <Ionicons name="calendar-outline" size={20} color="#64748B" />
            </Pressable>

            <Text style={styles.inputLabel}>Preference</Text>
            <Pressable style={styles.selectInput}>
              <Text>Cash</Text>
              <Ionicons name="chevron-down" size={20} color="#64748B" />
            </Pressable>

            <Text style={styles.inputLabel}>Default Concurrency</Text>
            <Pressable style={styles.selectInput}>
              <View style={styles.currencyOption}>
                {/* <Image 
                  source={require("@/assets/images/us-flag.png")} 
                  style={styles.flagIcon} 
                /> */}
                <Text>USD $</Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#64748B" />
            </Pressable>

            <View style={styles.buttonRow}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setIsNewReportDrawerVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  logo: {
    height: 24,
    width: 48,
  },
  userName: {
    fontSize: 14,
    color: "#64748B",
  },
  filterSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
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
  filterText: {
    color: "#64748B",
    fontSize: 14,
  },
  expenseList: {
    gap: 16,
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // This is for Android shadow
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  expenseDetails: {
    gap: 2,
  },
  detailText: {
    fontSize: 12,
    color: "#64748B",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    height: 24,
  },
  statusSubmitted: {
    backgroundColor: "#FEF9C3",
  },
  statusText: {
    fontSize: 12,
    color: "#854D0E",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  expenseId: {
    fontSize: 12,
    color: "#64748B",
  },
  statussubmitted: {
    backgroundColor: "#FEF9C3",
  },
  statusapproved: {
    backgroundColor: "#DCFCE7",
  },
  statuspaid: {
    backgroundColor: "#E0F2FE",
  },
  submittedText: {
    color: "#854D0E",
  },
  approvedText: {
    color: "#166534",
  },
  paidText: {
    color: "#075985",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  drawer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
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
  addButton: {
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
  newReportDrawer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
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
  placeholderText: {
    color: "#94A3B8",
  },
  currencyOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flagIcon: {
    width: 24,
    height: 16,
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
});
