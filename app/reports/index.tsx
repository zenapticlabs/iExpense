import React from "react";
import {
  StyleSheet,
  Pressable,
  Image,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback, useEffect } from "react";
import { ReportStatusBgColor, ReportStatusTextColor } from "@/utils/UtilData";
import { ICreateReportPayload, IReport } from "@/constants/types";
import { reportService } from "@/services/reportService";
import NewReportDrawer from "@/components/report/NewReportDrawer";
import { useFocusEffect } from "@react-navigation/native";
import LoadingScreen from "@/components/LoadingScreen";
import SelectDataRangePicker, {
  DATE_OPTIONS,
} from "@/components/report/SelectDataRangePicker";
import BottomNavBar from "@/components/BottomNavBar";
import { authService } from "@/services/authService";

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
  const [filteredReports, setFilteredReports] = useState<IReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDataRange] = useState(DATE_OPTIONS[0].value);
  const [user, setUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isNewReportDrawerVisible, setIsNewReportDrawerVisible] =
    useState(false);

  const router = useRouter();

  const fetchReports = async () => {
    try {
      const data = await reportService.getReports();
      setReports(data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
    }
  };

  const fetchUserData = async () => {
    const data = await authService.getMe();
    setUser(data);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchReports();
      fetchUserData();
      setLoading(false);
    }, [])
  );

  useEffect(() => {
    const filteredReports = reports
      .filter((report) =>
        filterByDateRange(new Date(report.created_at), dateRange)
      )
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    setFilteredReports(filteredReports);
  }, [dateRange, reports]);

  const handleCreateNewReport = async (report: ICreateReportPayload) => {
    try {
      const newReport = await reportService.createReport(report);
      setReports([...reports, newReport]);
      setIsNewReportDrawerVisible(false);
      router.push(`/reports/details?id=${newReport.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchReports();
    } finally {
      setRefreshing(false);
    }
  };

  const filterByDateRange = (date: Date, selectedRange: string) => {
    const today = new Date();

    const targetDate = new Date(date);

    switch (selectedRange) {
      case "last_3_months": {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        return targetDate >= threeMonthsAgo && targetDate <= today;
      }

      case "last_6_months": {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        return targetDate >= sixMonthsAgo && targetDate <= today;
      }

      case "this_year": {
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        return targetDate >= startOfYear && targetDate <= today;
      }

      case "last_year": {
        const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
        const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
        return targetDate >= startOfLastYear && targetDate <= endOfLastYear;
      }

      default:
        return true; // If no valid range is selected, include all dates
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/brand.png")}
            style={styles.logo}
          />
          <Text style={styles.userName}>
            {user?.first_name} {user?.last_name}
          </Text>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.title}>Expense Reports</Text>
          <SelectDataRangePicker onChange={setDataRange} value={dateRange} />
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <LoadingScreen />
          </View>
        ) : (
          <ScrollView
            style={styles.reportList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          >
            {filteredReports.map((report, index) => (
              <ReportItem key={`${report.id}-${index}`} report={report} />
            ))}
          </ScrollView>
        )}
        <BottomNavBar
          onNewReport={() => setIsNewReportDrawerVisible(true)}
          page="reports"
        />
        <NewReportDrawer
          isVisible={isNewReportDrawerVisible}
          onClose={() => setIsNewReportDrawerVisible(false)}
          onSave={handleCreateNewReport}
          haveCreditCard={user?.cc_card}
        />
      </View>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 24,
    height: 60,
    paddingHorizontal: 20,
  },
  logo: {
    height: 48,
    width: 96,
  },
  userName: {
    fontSize: 20,
    color: "#1E1E1E",
    fontFamily: "SFProDisplay",
  },
  filterSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1E1E1E",
    fontFamily: "SFProDisplay",
  },

  reportList: {
    gap: 16,
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 20,
  },
  reportItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    boxShadow: "0px 2px 15px 0px rgba(0, 0, 0, 0.07)",
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
    color: "#1e1e1e",
    fontFamily: "SFProDisplay",
  },
  reportAmount: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1e1e1e",
    fontFamily: "SFProDisplay",
  },
  reportDetails: {
    gap: 2,
  },
  detailText: {
    fontSize: 13,
    color: "#5B5B5B",
    fontFamily: "SFProDisplay",
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
    fontFamily: "SFProDisplay",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reportId: {
    fontSize: 13,
    color: "#5B5B5B",
    marginBottom: 4,
    fontFamily: "SFProDisplay",
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
    paddingTop: 12,
    backgroundColor: "white",
    paddingBottom: 24,
  },
  tabItem: {
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#1e1e1e",
    width: 42,
    height: 42,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  tabText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    fontFamily: "SFProDisplay",
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
  loaderContainer: {
    marginTop: 57,
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
