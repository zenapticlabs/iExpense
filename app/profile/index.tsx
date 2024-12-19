import { StyleSheet, Pressable, Image } from "react-native";
import { Link, router } from "expo-router";
import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import Divider from "@/components/Divider";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const handleLogout = async () => {
    // Add your logout logic here, for example:
    await signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Profile</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User info</Text>
        <Text style={styles.name}>James Stewart</Text>
        <Text style={styles.department}>IT</Text>
      </View>
      <Divider />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact details</Text>
        <View style={styles.contactItem}>
          <Ionicons name="mail-outline" size={20} color="#64748B" />
          <Text style={styles.contactText}>example@gmail.com</Text>
        </View>
        <View style={styles.contactItem}>
          <Ionicons name="call-outline" size={20} color="#64748B" />
          <Text style={styles.contactText}>+12345678</Text>
        </View>
      </View>

      <Divider />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Saved credit card</Text>
        <Pressable style={styles.addCardButton}>
          <Ionicons name="add" size={24} color="#1E3A8A" />
          <Text style={styles.addCardText}>Add credit card</Text>
        </Pressable>
      </View>

      <Divider />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Default concurrency</Text>
        <Pressable style={styles.currencySelector}>
          <View style={styles.currencyOption}>
            {/* <Image 
              source={require('@/assets/images/us-flag.png')} 
              style={styles.flag}
            /> */}
            <Text style={styles.currencyText}>USD $</Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#64748B" />
        </Pressable>
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
        <View style={styles.tabItem}>
          <Ionicons name="document-text-outline" size={24} color="#64748B" />
          <Text style={styles.tabText}>Reports</Text>
        </View>
        <Link href="/auth" style={styles.tabItem}>
          <View style={styles.addButton}>
            <Ionicons name="add" size={24} color="white" />
          </View>
        </Link>
        <View style={styles.tabItem}>
          <Ionicons name="person" size={24} color="#1E3A8A" />
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
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
  },
  department: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactText: {
    marginLeft: 12,
    fontSize: 14,
  },
  addCardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
  },
  addCardText: {
    marginLeft: 8,
    color: "#1e1e1e",
    fontWeight: "700",
    fontSize: 17,
  },
  currencySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
  },
  currencyOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    width: 24,
    height: 16,
    marginRight: 8,
  },
  currencyText: {
    fontSize: 14,
  },
  footer: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  forgotPassword: {
    color: "#64748B",
    marginBottom: 16,
    textDecorationLine: "underline",
    fontSize: 17,
  },
  logout: {
    color: "#EF4444",
    textDecorationLine: "underline",
    marginTop: 16,
    fontSize: 17,
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
});
