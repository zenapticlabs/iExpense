import { ReportTypes, ReportPreferences } from "@/utils/UtilData";
import { useEffect } from "react";
import { StyleSheet, Pressable, View, Text, ScrollView } from "react-native";
import CurrencyDropdown from "../CurrencyDropdown";
import { ICreateReportPayload } from "@/constants/types";
import DefaultModal from "../DefaultModal";
import { Controller, useForm } from "react-hook-form";
import GeneralForm from "../GeneralForms/GeneralForm";

interface NewReportDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (report: ICreateReportPayload) => void;
  haveCreditCard: boolean;
}

interface FormData {
  reportType: string;
  purpose: string;
  preference: string;
  currency: string;
  date: string;
}

const FormData = [
  {
    name: "purpose",
    label: "Purpose",
    type: "text",
    required: true,
  },
  {
    name: "expense_type",
    label: "Report Type",
    type: "dropdown",
    options: ReportTypes,
    required: true,
  },
  {
    name: "date",
    label: "Date",
    type: "date",
    required: true,
  },
  {
    name: "payment_method",
    label: "Preference",
    type: "dropdown",
    options: ReportPreferences,
    required: true,
  },
];

export default function NewReportDrawer({
  isVisible,
  onClose,
  onSave,
  haveCreditCard,
}: NewReportDrawerProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
  } = useForm();

  const paymentMethod = watch("payment_method");

  useEffect(() => {
    if (paymentMethod === "Credit Card" && !haveCreditCard) {
      setError("payment_method", {
        message: "Please add credit card information in the profile",
      });
    }
  }, [paymentMethod, haveCreditCard]);

  const onSubmit = (data: any) => {
    onSave(data);
  };

  useEffect(() => {
    reset();
  }, [isVisible]);

  return (
    <DefaultModal isVisible={isVisible} onClose={onClose}>
      <View className="flex-col bg-white px-5 pb-5">
        <View className="flex-row justify-center items-center pt-4 px-4">
          <View className="h-1.5 w-8 bg-[#DDDDDD] rounded-md" />
        </View>
        <Text className="text-xl font-semibold mb-4">New Report</Text>
        <ScrollView className="flex-1">
          {FormData.map((item) => (
            <GeneralForm field={item} control={control} errors={errors} />
          ))}
          <Controller
            control={control}
            name="report_currency"
            defaultValue="USD"
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="">
                <Text className="font-sfpro text-base font-medium text-[#1E1E1E] mb-1">
                  Currency
                  <Text className="text-red-500">*</Text>
                </Text>
                <CurrencyDropdown value={value} onChange={onChange} />
              </View>
            )}
          />
        </ScrollView>
        <View className="flex-row gap-3 mt-3">
          <Pressable
            className="flex-1 p-3 rounded-lg items-center bg-[#F1F5F9]"
            onPress={onClose}
          >
            <Text className="text-[#1E293B] font-medium">Cancel</Text>
          </Pressable>
          <Pressable
            className="flex-1 p-3 rounded-lg items-center bg-[#1E3A8A]"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-white font-medium">Save</Text>
          </Pressable>
        </View>
      </View>
    </DefaultModal>
  );
}
