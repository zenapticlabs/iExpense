import { StyleSheet, Pressable, Image, Modal, TextInput, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import {
  ReportStatusBgColor,
  ReportStatusTextColor,
} from "@/utils/UtilData";
import { ICreateReportPayload, IReport } from "@/constants/types";
import { reportService } from "@/services/reportService";
import NewReportDrawer from "@/components/report/NewReportDrawer";

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
          <Text style={styles.reportTitle}>{report.purpose}</Text>
          <Text style={styles.reportId}>{report.report_number}</Text>
        </View>
        <Text style={styles.reportAmount}>${report.report_amount}</Text>
        <View style={styles.reportDetails}>
          <Text style={styles.detailText}>
            Submission: {report.report_submit_date || "N/A"}
          </Text>
          <Text style={styles.detailText}>
            Approval: {report.integration_date || "N/A"}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: ReportStatusBgColor(report.report_status) },
        ]}
      >
        <Text
          style={[
            styles.statusText,
            { color: ReportStatusTextColor(report.report_status) },
          ]}
        >
          {report.report_status.charAt(0).toUpperCase() +
            report.report_status.slice(1)}
        </Text>
      </View>
    </Pressable>
  </Link>
);

export default function ReportsScreen() {
  const [reports, setReports] = useState<IReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState(DATE_OPTIONS[0]);
  const [isDateRangeDrawerVisible, setIsDateRangeDrawerVisible] =
    useState(false);
  const [isNewReportDrawerVisible, setIsNewReportDrawerVisible] =
    useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await reportService.getReports();
        setReports(data);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleCreateNewReport = async (report: ICreateReportPayload) => {
    const newReport = await reportService.createReport(report);
    setReports([...reports, newReport]);
    setIsNewReportDrawerVisible(false);
  };
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

      <ScrollView style={styles.reportList} showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          reports.map((report, index) => (
            <ReportItem key={`${report.id}-${index}`} report={report} />
          ))
        )}
      </ScrollView>
      <View style={styles.tabBar}>
        <View style={[styles.tabItem]}>
          <Ionicons name="document-text" size={24} color="#1e1e1e" />
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
                <Text>{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
      <NewReportDrawer
        isVisible={isNewReportDrawerVisible}
        onClose={() => setIsNewReportDrawerVisible(false)}
        onSave={handleCreateNewReport}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
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
  reportList: {
    gap: 16,
    flex: 1,
  },
  reportItem: {
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
  reportTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  reportAmount: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  reportDetails: {
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
  reportId: {
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
  },
  tabItem: {
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#1e1e1e",
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
