import { ReportTypes, ReportPreferences } from "@/utils/UtilData";
import { useEffect } from "react";
import { Pressable, View, Text, ScrollView } from "react-native";
import CurrencyDropdown from "../CurrencyDropdown";
import { ICreateReportPayload } from "@/constants/types";
import DefaultModal from "../DefaultModal";
import { Controller, useForm } from "react-hook-form";
import GeneralForm from "../GeneralForms/GeneralForm";
import SwipeToCloseDrawer from "../SwipeToCloseGesture";
import GeneralDropdown from "../GeneralForms/GeneralDropdown";

interface NewReportDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (report: ICreateReportPayload) => void;
  defaultCurrency: string;
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
    defaultValue: "Domestic",
    required: true,
  },
  {
    name: "report_date",
    label: "Date",
    type: "date",
    required: true,
  },
  // {
  //   name: "payment_method",
  //   label: "Payment Method",
  //   type: "dropdown",
  //   options: ReportPreferences,
  //   required: true,
  // },
];

export default function NewReportDrawer({
  isVisible,
  onClose,
  onSave,
  defaultCurrency,
  haveCreditCard,
}: NewReportDrawerProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = (data: any) => {
    onSave(data);
  };

  useEffect(() => {
    console.log(errors);
  }, [errors])

  const closeDrawer = () => {
    reset();
    onClose();
  }

  return (
    <DefaultModal isVisible={isVisible} onClose={closeDrawer}>
      <View className="flex-1 flex-col bg-white px-5 pb-5">
        <SwipeToCloseDrawer onClose={closeDrawer}>
          <Text className="text-xl font-semibold mb-4">New Report</Text>
        </SwipeToCloseDrawer>
        <ScrollView className="flex-grow" contentContainerStyle={{ flexGrow: 1, paddingBottom: 240 }}>
          {FormData.map((item) => (
            <GeneralForm field={item} control={control} errors={errors} />
          ))}
          <Controller
            control={control}
            name="payment_method"
            rules={{
              required: true,
              validate: (value) => {
                console.log(value, haveCreditCard)
                return value === "Credit Card" && !haveCreditCard ? "No registered credit cards found" : true
              }
            }}
            defaultValue={"Cash"}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Text className="font-sfpro text-base font-medium text-[#1E1E1E] mb-1">
                  Payment Method <Text className="text-red-500">*</Text>
                </Text>
                <GeneralDropdown value={value} onChange={onChange} defaultOptions={ReportPreferences} />
                {errors["payment_method"] && (
                  <Text style={{ color: "red" }}>
                    {errors["payment_method"]?.message?.toString()}
                  </Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="report_currency"
            defaultValue={defaultCurrency}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="mt-2">
                <Text className="font-sfpro text-base font-medium text-[#1E1E1E] mb-1">
                  Currency <Text className="text-red-500">*</Text>
                </Text>
                <CurrencyDropdown value={value} onChange={onChange} />
              </View>
            )}
          />
        </ScrollView>
        <View className="flex-row gap-3 mt-3">
          <Pressable
            className="flex-1 ml-3 p-4 rounded-lg items-center bg-[#F1F5F9]"
            onPress={closeDrawer}
          >
            <Text className="text-[#1E293B] font-medium">Cancel</Text>
          </Pressable>
          <Pressable
            className="flex-1 ml-3 p-4 rounded-lg items-center bg-[#1E3A8A]"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-white font-medium">Save</Text>
          </Pressable>
        </View>
      </View>
    </DefaultModal>
  );
}
