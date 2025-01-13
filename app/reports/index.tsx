import { StyleSheet, Pressable, Image, Modal, TextInput } from "react-native";
import { Link, useRouter } from "expo-router";
import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ReportStatusBgColor, ReportStatusTextColor } from "@/utils/UtilData";
import { SelectList } from "react-native-dropdown-select-list";
import { IReport } from "@/constants/types";
import { mockReports } from "@/constants/mockData";

const DATE_OPTIONS = [
  { label: "Last 3 months", value: "last_3_months" },
  { label: "Last 6 months", value: "last_6_months" },
  { label: "This year", value: "this_year" },
  { label: "Last year", value: "last_year" },
];

const ReportItem = ({ report }: { report: IReport }) => (
  <Link href={`/reports/details?id=${report.id}`} asChild>
    <Pressable style={styles.reportItem}>
      <View>
        <View style={styles.titleRow}>
          <Text style={styles.reportTitle}>{report.title}</Text>
          <Text style={styles.reportId}>{report.id}</Text>
        </View>
        <Text style={styles.reportAmount}>${report.amount.toFixed(2)}</Text>
        <View style={styles.reportDetails}>
          <Text style={styles.detailText}>
            Submission: {report.submission || "N/A"}
          </Text>
          <Text style={styles.detailText}>
            Approval: {report.approval || "N/A"}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: ReportStatusBgColor(report.state) },
        ]}
      >
        <Text
          style={[
            styles.statusText,
            { color: ReportStatusTextColor(report.state) },
          ]}
        >
          {report.state.charAt(0).toUpperCase() + report.state.slice(1)}
        </Text>
      </View>
    </Pressable>
  </Link>
);

export default function ReportsScreen() {
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
          <Ionicons name="calendar-clear-outline" size={20} color="#5B5B5B" />
          <Text
            onPress={() => setIsDateRangeDrawerVisible(true)}
            style={styles.filterText}
          >
            This month
          </Text>
        </Pressable>
      </View>

      <View style={styles.reportList}>
        {mockReports.map((report, index) => (
          <ReportItem key={`${report.id}-${index}`} report={report} />
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
        <Link href="/profile" asChild style={styles.tabItem}>
          <View>
            <Ionicons name="person-outline" size={24} color="#64748B" />
            <Text style={styles.tabText}>My Profile</Text>
          </View>
        </Link>
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
                <Text style={[
                  styles.dateOptionLabel]}>{option.label}</Text>
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
            <Text style={styles.reportdrawerTitle}>New Report</Text>

            <Text style={styles.inputLabel}>Purpose</Text>
            <TextInput style={styles.input} placeholder="example" />

            <Text style={styles.inputLabel}>Report Type</Text>
            <SelectList             
              setSelected={(val: any) => setSelected(val)}
              data={data}
              save="value"
              style={styles.listSelect}
            />
            <Text style={styles.inputLabel}>Date</Text>
            <Pressable style={styles.selectInput}>
              <Text style={styles.selectInputText}>Nov 5, 2024</Text>
              <Ionicons name="calendar-outline" size={24} color="#5B5B5B" />
            </Pressable>

            <Text style={styles.inputLabel}>Preference</Text>
            <Pressable style={styles.selectInput}>
              <Text style={styles.selectInputText}>Cash</Text>
              <Ionicons name="chevron-down" size={24} color="#5B5B5B" />
            </Pressable>

            <Text style={styles.inputLabel}>Default Concurrency</Text>
            <Pressable style={styles.selectInput}>
              <View style={styles.currencyOption}>
                {/* <Image 
                  source={require("@/assets/images/us-flag.png")} 
                  style={styles.flagIcon} 
                /> */}
                <Image
                    source={require('../../assets/images/usa.png')} 
                    style={styles.flagIcon}     
                            />
                <Text style={styles.selectInputText}>USD $</Text>
              </View>
              <Ionicons name="chevron-down" size={24} color="#5B5B5B" />
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
    height:40,
  },
  logo: {
    height: 24,
    width: 48,
  },
  userName: {
    fontSize: 15,
    color: "#1E1E1E",
    fontFamily: "SFProDisplay"
  },
  filterSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color:'#1E1E1E',
    fontFamily: "SFProDisplay"
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
    color: "#5B5B5B",
    fontSize: 13,
    fontFamily: "SFProDisplay"
  },
  reportList: {
    gap: 16,
  },
  reportItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8,
    minHeight:134,
    boxShadow: '0px 2px 15px 0px rgba(0, 0, 0, 0.07)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // This is for Android shadow
  },
  reportTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
    color:'#1e1e1e',
    fontFamily: "SFProDisplay"
  },
  reportAmount: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    color:'#1e1e1e',
    fontFamily: "SFProDisplay"
  },
  reportDetails: {
    gap: 2,
  },
  detailText: {
    fontSize: 13,
    color: "#5B5B5B",
    fontFamily: "SFProDisplay"
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    height: 26,
  },
  statusSubmitted: {
    backgroundColor: "#EAE4C7",
  },
  statusText: {
    fontSize: 12,
    color: "#854D0E",
    fontFamily: "SFProDisplay"
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reportId: {
    fontSize: 13,
    color: "#5B5B5B",
    marginBottom:4,
    fontFamily: "SFProDisplay"
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
    fontFamily: "SFProDisplay",
    color:'#1E1E1E',
  },
  reportdrawerTitle:{
    fontSize:22,
    fontWeight: 700,
    fontFamily: "SFProDisplay",
    color:'#1E1E1E',
    marginBottom:10,
    lineHeight:28,
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
    height:56,
    fontFamily: "SFProDisplay"
  },
  selectedOption: {
    backgroundColor: "#17317F1A",
    borderColor: "#17317F",
  },
  dateOptionLabel: {
    fontSize: 15,
    lineHeight: 20,
    color:'#1E1E1E',
    fontFamily: "SFProDisplay"
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
    fontSize: 15,
    color: "#1E1E1E",
    marginBottom: 4,
    lineHeight:20,
    fontFamily: "SFProDisplay",
    fontWeight:400,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    height:48,
    fontSize:15,
    fontFamily: "SFProDisplay",
    color:'#888888'
  },
  listSelect:{
    fontSize:15,
    fontFamily: "SFProDisplay",
    color:'#000000'
  },
  selectInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  selectInputText:{
    fontSize:15,
    fontWeight:400,
    fontFamily: "SFProDisplay",
    color:'#1E1E1E'
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
    width: 20,
    height: 13,
    marginRight: 8,
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
    backgroundColor: "#F5F5F5",
    height:56,
    justifyContent:'center'
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#17317F",
    height:56,
    justifyContent:'center'
  },
  cancelButtonText: {
    color: "#1E1E1E",
    fontWeight: "600",
    fontSize:17,
    fontFamily: "SFProDisplay",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize:17,
    fontFamily: "SFProDisplay",
  },
});
