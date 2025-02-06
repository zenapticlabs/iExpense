import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { reportService } from "@/services/reportService";
import DeleteExpenseItemDrawer from "./DeleteExpenseItemDrawer";
import DefaultModal from "@/components/DefaultModal";
import { Controller, useForm } from "react-hook-form";
import GeneralForm from "@/components/GeneralForms/GeneralForm";
import ReceiptAmountForm from "@/components/GeneralForms/ReceiptAmountForm";
import { ExpenseDetailsInfos } from "@/utils/UtilData";
import GeneralUploadForm from "@/components/GeneralForms/GeneralUploadPanel";
import { FormData } from "../FormData";
import { formatDate } from "@/utils/UtilFunctions";
import { Calendar } from "react-native-calendars";

interface EditExpenseDrawerProps {
  reportId: string;
  selectedExpense: any;
  reportStatus: string;
  exchangeRates: any;
  setSelectedExpense: (expense: any) => void;
  onDeleteExpense: (expenseId: string) => void;
  onEditExpense: (expense: any) => void;
  defaultCurrency: string;
}

export default function EditExpenseDrawer({
  reportId,
  selectedExpense,
  setSelectedExpense,
  reportStatus,
  onDeleteExpense,
  onEditExpense,
  exchangeRates,
  defaultCurrency,
}: EditExpenseDrawerProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();

  const formValues = watch();
  useEffect(() => {
    if (selectedExpense) {
      reset({
        ...selectedExpense,
        origin: selectedExpense?.origin_destination.split("_")[0],
        destination: selectedExpense?.origin_destination.split("_")[1],
      });
    }
  }, [selectedExpense]);

  const [newPayload, setNewPayload] = useState<any>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const handleDeletePress = () => {
    setIsDeleteModalVisible(true);
  };
  const handleConfirmDelete = async () => {
    try {
      await reportService.deleteReportItem(reportId, selectedExpense.id);
      onDeleteExpense(selectedExpense.id);
    } catch (error) {
      console.error("Error deleting report item:", error);
    }
    setIsDeleteModalVisible(false);
    handleClose();
  };

  const handleEditExpense = () => {
    onEditExpense(newPayload);
  };

  const onSubmit = async (data: any) => {
    const { file, ...rest } = data;
    const payload = {
      ...rest,
      origin_destination: `${data?.origin}_${data?.destination}`,
    };
    if (file) {
      payload.filename = file?.name;
    }
    console.log(payload);
    try {
      const response = await reportService.updateReportItem(
        reportId,
        selectedExpense.id,
        payload
      );
      if (response?.presigned_url && file) {
        await fetch(response.presigned_url, {
          method: "PUT",
          body: file.file,
          headers: {
            "Content-Type": file.mimeType,
          },
        });
      }

      onEditExpense(response);
      handleClose();
    } catch (error) {
      console.error("Error creating report item:", error);
    }
  };

  const handleClose = () => {
    setSelectedExpense(null);
  };

  const isReceiptRequired =
    ExpenseDetailsInfos?.[
      selectedExpense?.expense_type as keyof typeof ExpenseDetailsInfos
    ]?.receiptRequired;

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
      { name: "note", label: "Note", type: "text", required: true },
    ];
  };

  const isDisabled = reportStatus !== "Open";

  return (
    <DefaultModal isVisible={selectedExpense !== null} onClose={handleClose}>
      <View className="flex-1 p-4 bg-white">
        <Text className="text-2xl font-semibold mb-5 font-sfpro">
          {reportStatus === "Open" ? "Edit Expense" : "View Receipt"}
        </Text>

        {ExpenseDetailsInfos?.[selectedExpense?.expense_type as string]
          ?.errorMessage && (
          <View className="bg-[#FEF2F2] rounded-lg p-4 mb-4 border border-[#FCA5A5]">
            <Text className="font-sfpro text-sm font-medium text-[#DC2626]">
              {
                ExpenseDetailsInfos?.[selectedExpense?.expense_type as string]
                  ?.errorMessage
              }
            </Text>
          </View>
        )}
        <ScrollView className="flex-1">
          <View className="mb-4">
            <Text className="font-sfpro text-base font-medium text-[#1E1E1E] mb-1">
              Expense type
            </Text>
            <View className="border border-[#ccc] rounded-lg font-sfpro text-base text-[#1E1E1E] px-4 py-2.5">
              {selectedExpense?.expense_type}
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
                  if (!isDisabled) {
                    onChange(day.dateString);
                  }
                  setShowDatePicker(false);
                };
                return (
                  <View>
                    <Pressable
                      className={`border border-[#ccc] rounded-lg font-sfpro text-base text-[#1E1E1E] px-4 py-2.5`}
                      onPress={() => {
                        if (!isDisabled) {
                          setShowDatePicker(true);
                        }
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
          {FormData?.[
            selectedExpense?.expense_type as keyof typeof FormData
          ]?.fields.map((field) => (
            <GeneralForm
              field={field}
              control={control}
              errors={errors}
              disabled={isDisabled}
            />
          ))}
          <ReceiptAmountForm
            control={control}
            defaultCurrency={defaultCurrency}
            errors={errors}
            exchangeRates={exchangeRates}
            disabled={isDisabled}
          />
          {selectedExpense?.expense_type &&
            getDefaultFormData(selectedExpense?.expense_type).map(
              (field: any) => (
                <GeneralForm
                  field={field}
                  control={control}
                  errors={errors}
                  disabled={isDisabled}
                />
              )
            )}
          <Controller
            control={control}
            name="file"
            rules={{
              required: isReceiptRequired ? "Please upload file" : false,
            }}
            render={({ field: { onChange, onBlur, value } }) => {
              return (
                <GeneralUploadForm
                  reportId={reportId}
                  setValue={setValue}
                  formValues={formValues}
                  required={isReceiptRequired}
                  onChange={onChange}
                  value={value}
                  errors={errors}
                  disabled={isDisabled}
                />
              );
            }}
          />
        </ScrollView>
        {reportStatus === "Open" && (
          <View className="flex-row justify-between mt-5">
            <TouchableOpacity
              className="p-4 rounded-lg items-center justify-center border border-red-500 w-14 h-14"
              onPress={handleDeletePress}
            >
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 ml-3 p-4 rounded-lg items-center bg-blue-900"
              onPress={handleSubmit(onSubmit)}
            >
              <Text className="text-white font-semibold font-sfpro">
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <DeleteExpenseItemDrawer
        isVisible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onDelete={handleConfirmDelete}
        reportItem={selectedExpense}
      />
    </DefaultModal>
  );
}
