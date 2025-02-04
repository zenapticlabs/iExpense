import {
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Link, router } from "expo-router";
import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import Divider from "@/components/Divider";
import CurrencyDropdown from "@/components/CurrencyDropdown";
import { useEffect, useState } from "react";
import { authService } from "@/services/authService";
import BottomNavBar from "@/components/BottomNavBar";
import DefaultModal from "@/components/DefaultModal";
import { formatDate } from "@/utils/UtilFunctions";
import { Calendar } from "react-native-calendars";
import { useForm, Controller } from "react-hook-form";

export default function ProfileScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [creditAddCardVisible, setCreditAddCardVisible] = useState(false);
  const [creditCard, setCreditCard] = useState<any>(null);
  const { signOut } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const handleLogout = async () => {
    await signOut();
  };

  useEffect(() => {
    fetchData();
    fetchCreditCard();
  }, []);

  const fetchCreditCard = async () => {
    const data = await authService.getCreditCard();
    setCreditCard(data);
  };

  const fetchData = async () => {
    const data = await authService.getMe();
    setUser(data);
  };

  const onSubmit = async (data: any) => {
    const response = await authService.addCreditCard(
      data.card_number,
      data.expiration_date
    );
    setCreditCard(response.credit_card);
    setCreditAddCardVisible(false);
  };

  const deleteCreditCard = async () => {
    const response = await authService.deleteCreditCard();
    setCreditCard(null);
    setDeleteConfirmationVisible(false);
  };

  const handleChangeCurrency = async (currency: string) => {
    const response = await authService.changeCurrency(currency);
    setUser(response);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View style={styles.container}>
        <Text style={styles.header}>My Profile</Text>
        <ScrollView>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>User info</Text>
            <Text style={styles.name}>
              {user?.first_name} {user?.last_name}
            </Text>
            <Text style={styles.department}>{user?.department}</Text>
          </View>
          <Divider />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact details</Text>
            <View style={styles.contactItem}>
              <Ionicons
                name="calendar-clear-outline"
                size={20}
                color="#64748B"
              />
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
            {creditCard?.card_number && (
              <View className="flex-col gap-2 mb-4 mt-2">
                <View className="flex-row gap-2 items-center justify-between">
                  <View className="flex-row gap-2 items-center">
                    <Ionicons name="card-outline" size={24} color="#5B5B5B" />
                    <Text className="font-sfpro text-base font-medium text-[#1E1E1E]">
                      Card Number
                    </Text>
                  </View>
                  <Text className="font-sfpro text-base font-medium text-[#1E1E1E]">
                    {creditCard?.card_number}
                  </Text>
                </View>
                <View className="flex-row gap-2 items-center justify-between">
                  <View className="flex-row gap-2 items-center">
                    <Ionicons
                      name="calendar-outline"
                      size={24}
                      color="#5B5B5B"
                    />
                    <Text className="font-sfpro text-base font-medium text-[#1E1E1E]">
                      Expiration Date
                    </Text>
                  </View>
                  <Text className="font-sfpro text-base font-medium text-[#1E1E1E]">
                    {formatDate(creditCard?.expiration_date)}
                  </Text>
                </View>
              </View>
            )}
            {!creditCard?.card_number && (
              <Pressable
                style={styles.addCardButton}
                onPress={() => setCreditAddCardVisible(true)}
              >
                <Ionicons name="add" size={24} color="#5B5B5B" />
                <Text style={styles.addCardText}>Add credit card</Text>
              </Pressable>
            )}
            {creditCard?.card_number && (
              <Pressable
                style={styles.addCardButton}
                onPress={() => setDeleteConfirmationVisible(true)}
              >
                <Ionicons name="trash-outline" size={24} color="#5B5B5B" />
                <Text style={styles.addCardText}>Delete credit card</Text>
              </Pressable>
            )}
          </View>

          <Divider />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Default concurrency</Text>
            <CurrencyDropdown
              value={user?.currency.toLowerCase()}
              onChange={(currency) => handleChangeCurrency(currency)}
            />
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
        </ScrollView>
        <BottomNavBar page="profile" />
      </View>
      <DefaultModal
        isVisible={deleteConfirmationVisible}
        onClose={() => setDeleteConfirmationVisible(false)}
      >
        <View className="flex-1 bg-white px-4 py-4">
          <Text className="text-2xl font-sfpro font-bold text-[#1E1E1E] mb-4">
            Are you sure you want to delete your credit card?
          </Text>
          <View className="flex-row justify-between mt-5">
            <TouchableOpacity
              className="flex-1 mr-2 px-4 py-2.5 rounded-lg bg-gray-100"
              onPress={() => setDeleteConfirmationVisible(false)}
            >
              <Text className="text-gray-600 text-lg text-center font-sfpro font-medium">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 ml-2 px-4 py-2.5 rounded-lg bg-blue-900"
              onPress={deleteCreditCard}
            >
              <Text className="!text-white text-lg text-center font-sfpro font-medium">
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </DefaultModal>

      <DefaultModal
        isVisible={creditAddCardVisible}
        onClose={() => setCreditAddCardVisible(false)}
      >
        <View className="flex-1 bg-white px-4 py-4">
          <Text className="text-2xl font-sfpro font-bold text-[#1E1E1E] mb-4">
            Add Credit Card
          </Text>
          <View key={"card_number"} style={{ marginBottom: 10 }}>
            <Text className="font-sfpro text-base font-medium text-[#1E1E1E] mb-1">
              Card number
              <Text className="!text-red-500">*</Text>
            </Text>
            <Controller
              control={control}
              name={"card_number"}
              rules={{
                required: `Card Number is required`,
                maxLength: {
                  value: 16,
                  message: "Card number must not exceed 16 characters",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <TextInput
                    className="border border-[#ccc] rounded-lg font-sfpro text-base text-[#1E1E1E] px-4 py-2.5"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                );
              }}
            />
            {errors["card_number"] && (
              <Text style={{ color: "red" }}>
                {errors["card_number"]?.message?.toString()}
              </Text>
            )}
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text className="font-sfpro text-base font-medium text-[#1E1E1E] mb-1">
              Date
              <Text className="!text-red-500">*</Text>
            </Text>
            <Controller
              control={control}
              name="expiration_date"
              rules={{ required: "Date is required" }}
              defaultValue={new Date().toISOString().split("T")[0]}
              render={({ field: { onChange, onBlur, value } }) => {
                const [showDatePicker, setShowDatePicker] = useState(false);
                const handleDateSelect = (day: any) => {
                  onChange(day.dateString);
                  setShowDatePicker(false);
                };
                return (
                  <View>
                    <Pressable
                      className="border border-[#ccc] rounded-lg font-sfpro text-base text-[#1E1E1E] px-4 py-2.5"
                      onPress={() => {
                        setShowDatePicker(true);
                      }}
                    >
                      <Text className="font-sfpro text-base font-medium text-[#1E1E1E]">
                        {formatDate(value)}
                      </Text>
                    </Pressable>
                    <DefaultModal
                      isVisible={showDatePicker}
                      onClose={() => setShowDatePicker(false)}
                    >
                      <View className="bg-white rounded-lg p-4 mx-5">
                        <Calendar
                          onDayPress={handleDateSelect}
                          markedDates={{
                            [value]: {
                              selected: true,
                              selectedColor: "#1E3A8A",
                            },
                          }}
                          theme={{
                            todayTextColor: "#1E3A8A",
                            selectedDayBackgroundColor: "#1E3A8A",
                          }}
                        />
                      </View>
                    </DefaultModal>
                  </View>
                );
              }}
            />
          </View>
          <View className="flex-row justify-between mt-5">
            <TouchableOpacity
              className="flex-1 mr-2 px-4 py-2.5 rounded-lg bg-gray-100"
              onPress={() => setCreditAddCardVisible(false)}
            >
              <Text className="text-gray-600 text-lg text-center font-sfpro font-medium">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 ml-2 px-4 py-2.5 rounded-lg bg-blue-900"
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="!text-white text-lg text-center font-sfpro font-medium">
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </DefaultModal>
    </SafeAreaView>
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
    fontFamily: "SFProDisplay",
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
    fontFamily: "SFProDisplay",
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1e1e1e",
    fontFamily: "SFProDisplay",
  },
  department: {
    fontSize: 15,
    color: "#888888",
    marginTop: 12,
    fontFamily: "SFProDisplay",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#1e1e1e",
    fontFamily: "SFProDisplay",
  },
  marginNone: {
    margin: 0,
  },
  addCardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 12,
    height: 48,
  },
  addCardText: {
    marginLeft: 8,
    color: "#1e1e1e",
    fontWeight: "700",
    fontSize: 17,
    fontFamily: "SFProDisplay",
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
    color: "#1E1E1E",
    fontFamily: "SFProDisplay",
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
    fontFamily: "SFProDisplay",
  },
  logout: {
    color: "#E12020",
    textDecorationLine: "underline",
    marginTop: 16,
    marginBottom: 16,
    fontSize: 17,
    fontFamily: "SFProDisplay",
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
    color: "#1e1e1e",
    marginTop: 4,
    fontFamily: "SFProDisplay",
  },
  activeTab: {
    color: "#1e1e1e",
  },
});
