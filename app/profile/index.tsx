import { StyleSheet, Pressable, Image } from "react-native";
import { Link, router } from "expo-router";
import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import Divider from "@/components/Divider";
import CurrencyDropdown from "@/components/CurrencyDropdown";
import { useEffect, useState } from "react";
import { authService } from "@/services/authService";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const [user, setUser] = useState<any>(null);
  const handleLogout = async () => {
    // Add your logout logic here, for example:
    await signOut();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await authService.getMe();
    setUser(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Profile</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User info</Text>
        <Text style={styles.name}>{user?.first_name} {user?.last_name}</Text>
        <Text style={styles.department}>{user?.department}</Text>
      </View>
      <Divider />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact details</Text>
        <View style={styles.contactItem}>
          <Ionicons name="calendar-clear-outline" size={20} color="#64748B" />
          <Text style={styles.contactText}>{user?.email}</Text>
        </View>
        <View style={styles.contactItem}>
          <Ionicons name="call-outline" size={20} color="#64748B" />
          <Text style={styles.contactText}>{user?.phone_number}</Text>
        </View>
      </View>

      <Divider />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Saved credit card</Text>
        <Pressable style={styles.addCardButton}>
          <Ionicons name="add" size={24} color="#5B5B5B" />
          <Text style={styles.addCardText}>Add credit card</Text>
        </Pressable>
      </View>

      <Divider />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Default concurrency</Text>
        <CurrencyDropdown value={user?.currency.toLowerCase()} onChange={() => {}} />
      </View>

      <Divider />
      <View style={styles.footer}>
        <Link href="/auth" style={styles.forgotPassword}>
          Forgot password?
        </Link>
        <Pressable onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.tabBar}>
        <Link href="/reports" asChild style={styles.tabItem}>
          <View>
            <Ionicons name="document-text-outline" size={24} color="#64748B" />
            <Text style={styles.tabText}>Reports</Text>
          </View>
        </Link>
        <View style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </View>
        <View style={styles.tabItem}>
          <Ionicons name="person" size={24} color="#1e1e1e" />
          <Text style={[styles.tabText, styles.activeTab]}>My Profile</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 32,
    marginBottom: 24,
    fontFamily: "SFProDisplay"
  },
  section: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 17,
    color: "#1e1e1e",
    fontWeight: "700",
    marginBottom: 12,
    fontFamily: "SFProDisplay"
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    color:'#1e1e1e',
    fontFamily: "SFProDisplay"
  },
  department: {
    fontSize: 15,
    color: "#888888",
    marginTop: 12,
    fontFamily: "SFProDisplay"
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactText: {
    marginLeft: 12,
    fontSize: 15,
    color:'#1e1e1e',
    fontFamily: "SFProDisplay"
  },
  marginNone: {
    margin:0,
  },
  addCardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 12,
    height:48,
  },
  addCardText: {
    marginLeft: 8,
    color: "#1e1e1e",
    fontWeight: "700",
    fontSize: 17,
    fontFamily: "SFProDisplay"
  },
  currencySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 12,
  },
  currencyOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    width: 20,
    height: 13,
    marginRight: 8,
  },
  currencyText: {
    fontSize: 14,
    color:'#1E1E1E',
    fontFamily: "SFProDisplay"
  },
  footer: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  forgotPassword: {
    color: "#5B5B5B",
    marginBottom: 16,
    textDecorationLine: "underline",
    fontSize: 17,
    fontFamily: "SFProDisplay"
  },
  logout: {
    color: "#E12020",
    textDecorationLine: "underline",
    marginTop: 16,
    fontSize: 17,
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
    fontFamily: "SFProDisplay"
  },
  activeTab: {
    color: "#1E3A8A",
  },
});
