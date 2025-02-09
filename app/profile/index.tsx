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
import ChangePasswordDrawer from "@/components/profile/ChangePasswordDrawer";

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
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
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
      <View className="flex-1 bg-white">
        <Text className="text-xl font-semibold text-center mt-8 mb-6 font-sfpro">
          My Profile
        </Text>
        <ScrollView>
          <View className="my-5 px-5">
            <Text className="text-lg text-[#1e1e1e] font-bold mb-3 font-sfpro">
              User info
            </Text>
            <Text className="text-base font-medium text-[#1e1e1e] font-sfpro">
              {user?.first_name} {user?.last_name}
            </Text>
            <Text className="text-base text-gray-500 mt-3 font-sfpro">
              {user?.department}
            </Text>
          </View>

          <Divider />

          <View className="my-5 px-5">
            <Text className="text-lg text-[#1e1e1e] font-bold mb-3 font-sfpro">
              Contact details
            </Text>
            <View className="flex-row items-center mb-3">
              <Ionicons
                name="calendar-clear-outline"
                size={20}
                color="#64748B"
              />
              <Text className="ml-3 text-base text-[#1e1e1e] font-sfpro">
                {user?.email}
              </Text>
            </View>
            <View className="flex-row items-center mb-3">
              <Ionicons name="call-outline" size={20} color="#64748B" />
              <Text className="ml-3 text-base text-[#1e1e1e] font-sfpro">
                {user?.phone_number}
              </Text>
            </View>
          </View>

          <Divider />

          <View className="my-5 px-5">
            <Text className="text-lg text-[#1e1e1e] font-bold mb-3 font-sfpro">
              Saved credit card
            </Text>
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
            {!creditCard && (
              <Pressable
                className="flex-row items-center justify-center border border-[#DDDDDD] rounded-lg p-3 h-12"
                onPress={() => setCreditAddCardVisible(true)}
              >
                <Ionicons name="add" size={24} color="#5B5B5B" />
                <Text className="ml-2 text-[#1e1e1e] font-bold text-lg font-sfpro">
                  Add credit card
                </Text>
              </Pressable>
            )}
            {creditCard && (
              <Pressable
                className="flex-row items-center justify-center border border-[#DDDDDD] rounded-lg p-3 h-12"
                onPress={() => setDeleteConfirmationVisible(true)}
              >
                <Ionicons name="trash-outline" size={24} color="#5B5B5B" />
                <Text className="ml-2 text-[#1e1e1e] font-bold text-lg font-sfpro">
                  Delete credit card
                </Text>
              </Pressable>
            )}
          </View>

          <Divider />

          <View className="my-5 px-5">
            <Text className="text-lg text-[#1e1e1e] font-bold mb-3 font-sfpro">
              Default Currency
            </Text>
            <CurrencyDropdown
              value={user?.currency}
              onChange={(currency) => handleChangeCurrency(currency)}
            />
          </View>

          <Divider />

          <View className="flex-1 items-center mt-5">
            <Pressable
              onPress={() => setChangePasswordVisible(true)}
              className="text-[#5B5B5B] mb-4 underline text-lg font-sfpro"
            >
              Change password
            </Pressable>

            <Pressable onPress={handleLogout}>
              <Text className="text-[#E12020] underline mt-4 mb-4 text-lg font-sfpro">
                Logout
              </Text>
            </Pressable>
          </View>
        </ScrollView>
        <BottomNavBar page="profile" />
      </View>

      <ChangePasswordDrawer
        isVisible={changePasswordVisible}
        onClose={() => setChangePasswordVisible(false)}
      />

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
