import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
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
import SwipeToCloseDrawer from "../../SwipeToCloseGesture";
import { ReportPreferences } from "@/utils/UtilData";
interface EditExpenseDrawerProps {
  reportId: string;
  selectedExpense: any;
  reportStatus: string;
  exchangeRates: any;
  setSelectedExpense: (expense: any) => void;
  onDeleteExpense: (expenseId: string) => Promise<void>;
  onEditExpense: (expense: any) => Promise<void>;
  defaultCurrency: string;
  user: any;
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
  user,
}: EditExpenseDrawerProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    // setValue,
    trigger,
  } = useForm({
    mode: "onChange",
  });

  const formValues = watch();
  useEffect(() => {
    if (selectedExpense) {
      reset({
        ...selectedExpense,
        origin: selectedExpense?.origin_destination.split("_")[0],
        destination: selectedExpense?.origin_destination.split("_")[1],
        mileage_rate: selectedExpense?.mileage_rate?.rate
      });
    }
  }, [selectedExpense]);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const handleDeletePress = () => {
    setIsDeleteModalVisible(true);
  };
  const handleConfirmDelete = async () => {
    try {
      await reportService.deleteReportItem(reportId, selectedExpense.id);
      await onDeleteExpense(selectedExpense.id);
    } catch (error) {
      console.error("Error deleting report item:", error);
    }
    setIsDeleteModalVisible(false);
    handleClose();
  };

  const getBlobFromUri = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    return await response.blob();
  };

  const onSubmit = async (data: any) => {
    const { files, ...rest } = data;
    
    const receipts = files?.map((file: any) => ({
      ...(file.name ? { upload_filename: file.name } : file)
    }));
    
    const payload = {
      ...rest,
      origin_destination: `${data?.origin}_${data?.destination}`,
      receipts,
    };
    try {
      console.log(payload)
      const response = await reportService.updateReportItem(
        reportId,
        selectedExpense.id,
        payload
      );
      if (response?.receipts && files) {
        const filenameRegex = /^(\d+)_(.+)$/;
        const responseFileMap = response.receipts.reduce((acc: any, receipt: any) => {
          const match = receipt.filename.match(filenameRegex);
          if (match) {
            const originalFilename = match[2];
            acc[originalFilename] = receipt.presigned_url;
          }
          return acc;
        }, {});

        await Promise.all(
          files.filter((file: any) => file.name && file.uri).map(async (file: any) => {
            const presignedUrl = responseFileMap[file.name];
      
            if (presignedUrl) {
              let fileToUpload = file.file;
      
              if (!fileToUpload && file.uri) {
                fileToUpload = await getBlobFromUri(file.uri);
              }
      
              if (fileToUpload) {
                const mimeType = file.mimeType || "application/octet-stream";
      
                try {
                  const uploadResponse = await fetch(presignedUrl, {
                    method: "PUT",
                    body: fileToUpload,
                    headers: {
                      "Content-Type": mimeType,
                    },
                  });
      
                  if (!uploadResponse.ok) {
                    console.error(`Upload failed for ${file.name}:`, uploadResponse.statusText);
                  } else {
                    console.log(`Successfully uploaded ${file.name}`);
                  }
                } catch (error) {
                  console.error(`Error uploading ${file.name}:`, error);
                }
              }
            }
          })
        );
      }

      await onEditExpense(response);
      handleClose();
    } catch (error) {
      console.error("Error creating report item:", error);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedExpense(null);
  };

  const isReceiptRequired =
    ExpenseDetailsInfos?.[
      selectedExpense?.expense_type as keyof typeof ExpenseDetailsInfos
    ]?.receiptRequired;

  const getDefaultFormData = (expenseType: string) => {
    const formInfo = ExpenseDetailsInfos?.[expenseType as keyof typeof ExpenseDetailsInfos];
    const justificationRequired = formInfo?.justificationRequired || false;
    const noteRequired = formInfo?.errorMessage || false;

    return [
      {
        name: "justification",
        label: "Justification",
        type: "text",
        required: justificationRequired
      },
      {
        name: "note",
        label: "Note",
        type: "text",
        required: noteRequired,
        defaultValue: formInfo?.errorMessage,
        multiline: true
      },
    ];
  };

  const isDisabled = !(reportStatus === "Open" || reportStatus === "Rejected");
  console.log(reportStatus, isDisabled);

  return (
    <DefaultModal isVisible={selectedExpense !== null} onClose={handleClose}>
      <View className="flex-1 flex-col bg-white px-5 pb-5">
        <View>
          <SwipeToCloseDrawer onClose={handleClose}>
            <Text className="text-xl font-semibold mb-4">
              {reportStatus === "Open" ? "Edit Expense" : "View Expense"}
            </Text>
          </SwipeToCloseDrawer>

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
        </View>
        <ScrollView className="flex-grow" contentContainerStyle={{ flexGrow: 1, paddingBottom: 240 }}>
          <View className="mb-1">
            <Text className="font-sfpro text-base font-medium text-[#1E1E1E]">
              Expense type
            </Text>
            <View className="py-3 min-h-2">
              <Text className="font-sfpro text-base font-normal text-[#1E1E1E]">{selectedExpense?.expense_type}</Text>
            </View>
          </View>
          <View className="mb-1">
            <Text className="font-sfpro text-base font-medium text-[#1E1E1E]">
              User
            </Text>
            <View className="py-3 min-h-2">
              <Text className="font-sfpro text-base font-normal text-[#1E1E1E]">{user?.first_name} {user?.last_name}</Text>
            </View>
          </View>
          <View style={{ marginBottom: 10 }}>
            <GeneralForm field={{
              name: "expense_date",
              label: "Date",
              type: "date",
              required: true,
            }} control={control} errors={errors} />
          </View>
          <ReceiptAmountForm
            control={control}
            defaultCurrency={defaultCurrency}
            errors={errors}
            exchangeRates={exchangeRates}
            disabled={isDisabled}
            expenseType={selectedExpense?.expense_type}
            orgId={user?.org_id}
            trigger={trigger}
          />
          <GeneralForm field={{
            name: "payment_method",
            label: "Payment Method",
            type: "dropdown",
            options: ReportPreferences,
            required: true,
          }} control={control} errors={errors} />
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
            name="files"
            rules={{
              required: isReceiptRequired ? "Please upload receipts" : false,
            }}
            render={({ field: { onChange, onBlur, value } }) => {
              const initialFiles = value !== undefined ? value : formValues?.receipts || [];
              return (
                <GeneralUploadForm
                  reportId={reportId}
                  expenseId={selectedExpense?.id}
                  // setValue={setValue}
                  // formValues={formValues}
                  required={isReceiptRequired}
                  onChange={onChange}
                  value={initialFiles}
                  errors={errors}
                  disabled={isDisabled}
                />
              );
            }}
          />
        </ScrollView>
        {!isDisabled && (
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
      {/* </SwipeToCloseDrawer> */}
    </DefaultModal>
  );
}
