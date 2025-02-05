import {
  Pressable,
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import DefaultModal from "@/components/DefaultModal";
import RenderStep1 from "./RenderStep1";
import { useForm, Controller } from "react-hook-form";
import GeneralForm from "../../GeneralForms/GeneralForm";
import { FormData } from "../FormData";
import ReceiptAmountForm from "../../GeneralForms/ReceiptAmountForm";
import { ExpenseDetailsInfos, WarningMessages } from "@/utils/UtilData";
import GeneralUploadForm from "../../GeneralForms/GeneralUploadPanel";
import { reportService } from "@/services/reportService";
import { formatDate } from "@/utils/UtilFunctions";
import { Calendar } from "react-native-calendars";

interface CreateNewExpenseDrawerProps {
  isVisible: boolean;
  reportId: string;
  exchangeRates: any;
  onClose: () => void;
  onAddExpense: (reportItem: any) => void;
}

const getDefaultFormData = (expenseType: string) => {
  return [
    {
      name: "justification",
      label: "Justification",
      type: "text",
      required:
        ExpenseDetailsInfos?.[expenseType as keyof typeof ExpenseDetailsInfos]
          ?.justificationRequired || false,
    },
    { name: "note", label: "Note", type: "text" },
  ];
};

export default function CreateNewExpenseDrawer({
  isVisible,
  onClose,
  onAddExpense,
  reportId,
  exchangeRates,
}: CreateNewExpenseDrawerProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [currentStep, setCurrentStep] = useState(1);
  const [expenseType, setExpenseType] = useState<string | null>(null);

  const handleClose = () => {
    setCurrentStep(1);
    setExpenseType(null);
    reset();
    onClose();
  };

  const handleNextStep = () => setCurrentStep(2);
  const handleBack = () => setCurrentStep(1);

  const isReceiptRequired =
    ExpenseDetailsInfos?.[expenseType as keyof typeof ExpenseDetailsInfos]
      ?.receiptRequired;

  const onSubmit = async (data: any) => {
    const { file, ...rest } = data;
    const payload = {
      ...rest,
      filename: file?.name,
      expense_type: expenseType,
      origin_destination: `${data?.origin}_${data?.destination}`,
    };
    try {
      const response = await reportService.createReportItem(payload, reportId);
      if (response?.presigned_url && file) {
        await fetch(response.presigned_url, {
          method: 'PUT',
          body: file.file,
          headers: {
            'Content-Type': file.mimeType,
          },
        });
      }
      onAddExpense(response);
      handleClose();
    } catch (error) {
      console.error("Error creating report item:", error);
    }
  };

  return (
    <DefaultModal isVisible={isVisible} onClose={handleClose}>
      {currentStep === 1 ? (
        <RenderStep1
          expenseType={expenseType}
          setExpenseType={setExpenseType}
          handleClose={handleClose}
          handleNextStep={handleNextStep}
        />
      ) : (
        <View className="flex-1 p-5">
          <Text className="text-2xl font-semibold mb-4">
            Create New Expense
          </Text>
          {ExpenseDetailsInfos?.[expenseType as string]?.errorMessage && (
            <View className="bg-[#FEF2F2] rounded-lg p-4 mb-4 border border-[#FCA5A5]">
              <Text className="font-sfpro text-sm font-medium text-[#DC2626]">
                {ExpenseDetailsInfos?.[expenseType as string]?.errorMessage}
              </Text>
            </View>
          )}
          <ScrollView className="flex-1">
            <View className="mb-4">
              <Text className="font-sfpro text-base font-medium text-[#1E1E1E] mb-1">
                Expense type
              </Text>
              <View className="border border-[#ccc] rounded-lg font-sfpro text-base text-[#1E1E1E] px-4 py-2.5">
                {expenseType}
              </View>
            </View>
            <View style={{ marginBottom: 10 }}>
              <Text className="font-sfpro text-base font-medium text-[#1E1E1E] mb-1">
                Date
                <Text className="text-red-500">*</Text>
              </Text>
              <Controller
                control={control}
                name="expense_date"
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
            {FormData?.[expenseType as keyof typeof FormData]?.fields.map(
              (field) => (
                <GeneralForm field={field} control={control} errors={errors} />
              )
            )}
            <ReceiptAmountForm
              control={control}
              errors={errors}
              exchangeRates={exchangeRates}
            />
            {expenseType &&
              getDefaultFormData(expenseType).map((field: any) => (
                <GeneralForm field={field} control={control} errors={errors} />
              ))}
            <Controller
              control={control}
              name="file"
              rules={{
                required: isReceiptRequired ? "Please upload file" : false,
              }}
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <GeneralUploadForm
                    required={isReceiptRequired}
                    onChange={onChange}
                    value={value}
                    errors={errors}
                  />
                );
              }}
            />
          </ScrollView>

          <View className="flex-row justify-between mt-5">
            <TouchableOpacity
              className="flex-1 mr-2 px-4 py-2.5 rounded-lg bg-gray-100"
              onPress={handleBack}
            >
              <Text className="text-gray-600 text-lg text-center font-sfpro font-medium">
                Back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 ml-2 px-4 py-2.5 rounded-lg bg-blue-900"
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="text-white text-lg text-center font-sfpro font-medium">
                Add expense
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </DefaultModal>
  );
}
