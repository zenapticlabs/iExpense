import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image
} from "react-native";
import { useState } from "react";
import DefaultModal from "@/components/DefaultModal";
import RenderStep1 from "./RenderStep1";
import { useForm, Controller } from "react-hook-form";
import GeneralForm from "../../GeneralForms/GeneralForm";
import { FormData } from "../FormData";
import ReceiptAmountForm, { getMaxHotelRate } from "../../GeneralForms/ReceiptAmountForm";
import { ExpenseDetailsInfos } from "@/utils/UtilData";
import GeneralUploadForm from "../../GeneralForms/GeneralUploadPanel";
import { reportService } from "@/services/reportService";
import SwipeToCloseDrawer from "../../SwipeToCloseGesture";
import { ReportPreferences } from "@/utils/UtilData";
import commonService, { MileageRate } from "@/services/commonService";

interface CreateNewExpenseDrawerProps {
  isVisible: boolean;
  reportId: string;
  exchangeRates: any;
  onClose: () => void;
  onAddExpense: (reportItem: any) => void;
  handleAnalysePreview?: any;
  defaultCurrency: string;
  defaultPayment: string;
  reportType: string;
  orgId: number;
  user: any;
}

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

export default function CreateNewExpenseDrawer({
  isVisible,
  onClose,
  onAddExpense,
  reportId,
  orgId,
  reportType,
  exchangeRates,
  defaultCurrency,
  defaultPayment,
  user,
  handleAnalysePreview
}: CreateNewExpenseDrawerProps) {
  console.log(defaultPayment)
  const [currentStep, setCurrentStep] = useState(1);
  const [expenseType, setExpenseType] = useState<string | null>(null);
  const [analysePreview, setAnalysePreview] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({
    mode: "onChange",
  });

  const isReceiptRequired =
    ExpenseDetailsInfos?.[expenseType as keyof typeof ExpenseDetailsInfos]
      ?.receiptRequired || false;

  const handleClose = () => {
    setCurrentStep(1);
    setExpenseType(null);
    reset();
    onClose();
  };

  const handleNextStep = () => setCurrentStep(2);
  const handleBack = () => {
    reset();
    setCurrentStep(1)
  };

  const getBlobFromUri = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    return await response.blob();
  };

  const onSubmit = async (data: any) => {
    const { files, ...rest } = data;

    let mileage_rate = null;
    if (data.mileage_rate) {
      const mileageRates = await commonService.getMileageRates();
      mileage_rate = mileageRates.find((rate: MileageRate) => rate.rate === data.mileage_rate)?.id;
    }

    let hotel_daily_base_rate = null;
    if (expenseType === "Hotel") {
      const hotelRates = await commonService.getHotelDailyBaseRates();
      hotel_daily_base_rate = getMaxHotelRate(data?.city, hotelRates, defaultCurrency);
      hotel_daily_base_rate = hotel_daily_base_rate?.id
    }

    const receipts = files?.map((file: any) => ({
      upload_filename: file.name
    }))

    const payload = {
      ...rest,
      expense_type: expenseType,
      hotel_daily_base_rate,
      mileage_rate,
      origin_destination: `${data?.origin}_${data?.destination}`,
      receipts,
    };
    console.log(payload)
    try {
      const response = await reportService.createReportItem(payload, reportId);
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

        console.log(responseFileMap)

        await Promise.all(
          files.map(async (file: any) => {
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
      onAddExpense(response);
      handleClose();
    } catch (error) {
      console.error("Error creating report item:", error);
    }
  };

  return (
    <View>
      <DefaultModal isVisible={isVisible} onClose={handleClose}>
        <SwipeToCloseDrawer onClose={onClose}>
          {currentStep === 1 ? (
            <RenderStep1
              expenseType={expenseType}
              setExpenseType={setExpenseType}
              handleClose={handleClose}
              handleNextStep={handleNextStep}
              orgId={orgId}
              reportType={reportType}
            />
          ) : (
            <View className="flex-1 p-5">
              <Text className="text-[22px] font-bold mb-6 text-[#1E1E1E] fontFamily-sf">
                Create New Expense
              </Text>
              <View>
              <TouchableOpacity
                onPress={handleAnalysePreview}
                className="flex-1 mr-2 p-2.5 rounded-lg bg-gradient-to-r from-[#17317F] to-[#2958E5] min-h-[48px] h-[48px] flex flex-row justify-center items-center gap-3"
              >
                <Image
                  source={require("@/assets/images/stars.svg")}
                  resizeMode="contain"
                />
                <Text className="text-white text-[15px] text-center font-sfpro font-medium">
                  Analyse From Receipt
                </Text>
              </TouchableOpacity>
              <Text className="text-[14px] font-sm mt-4 text-center text-[#1E1E1E]">
                Max 1Mb; PDF, Xlx supported
              </Text>
              <View className="flex items-center justify-center flex-row gap-3">
                <span className="h-[1px] w-full bg-[#DDDDDD]"></span>
                <span className="text-[14px] font-sm my-4 text-center whitespace-nowrap text-[#1E1E1E]">
                  OR Add Manually
                </span>
                <span className="h-[1px] w-full bg-[#DDDDDD]"></span>
              </View>
              </View>

              <View>
                <Text className="text-[15px] font-normal mb-3 text-[#1E1E1E] fontFamily-sf">
                  Attached receipt
                </Text>
                <View className="border-[#DDDDDD] mb-4 relative rounded-[8px] h-[125px] flex flex-col items-center justify-center gap-2 border">
                  <Image
                    source={require("@/assets/images/file.svg")}
                    resizeMode="contain"
                  />
                  <Text className="text-[15px] font-normal text-[#1E1E1E] fontFamily-sf">
                    Receipt.PDF
                  </Text>

                  <TouchableOpacity className="absolute right-4 top-4">
                    <Image
                      source={require("@/assets/images/Trash.svg")}
                      resizeMode="contain"
                      
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {ExpenseDetailsInfos?.[expenseType as string]?.errorMessage && (
                <View className="bg-[#FEF2F2] rounded-lg p-4 mb-4 border border-[#FCA5A5]">
                  <Text className="font-sfpro text-sm font-medium text-[#DC2626]">
                    {ExpenseDetailsInfos?.[expenseType as string]?.errorMessage}
                  </Text>
                </View>
              )}
              <ScrollView className="flex-1">
                <View className="mb-3 fontFamily-sf">
                  <Text className="font-sfpro text-base font-medium text-[#5B5B5B] mb-2 fontFamily-sf">
                    Expense type
                  </Text>
                  <View className="p-3 min-h-[48px] rounded-[8px] bg-[#F5F5F5] border border-[#DDDDDD]">
                    <Text className="font-sfpro text-base font-normal text-[#1E1E1E]">
                      {expenseType}
                    </Text>
                  </View>
                </View>
                {/* <View className="mb-1">
                <Text className="font-sfpro text-base font-medium text-[#1E1E1E]">
                  User
                </Text>
                <View className="py-3 min-h-2">
                  <Text className="font-sfpro text-base font-normal text-[#1E1E1E]">{user?.first_name} {user?.last_name}</Text>
                </View>
              </View> */}
                <View style={{ marginBottom: 10 }}>
                  <GeneralForm
                    field={{
                      name: "expense_date",
                      label: "Date",
                      type: "date",
                      required: true,
                    }}
                    control={control}
                    errors={errors}
                  />
                </View>
                <ReceiptAmountForm
                  control={control}
                  errors={errors}
                  exchangeRates={exchangeRates}
                  defaultCurrency={defaultCurrency}
                  expenseType={expenseType}
                  orgId={orgId}
                  trigger={trigger}
                />
                <GeneralForm
                  field={{
                    name: "payment_method",
                    label: "Payment Method",
                    type: "dropdown",
                    options: ReportPreferences,
                    defaultValue: defaultPayment,
                    required: true,
                  }}
                  control={control}
                  errors={errors}
                />
                {FormData?.[expenseType as keyof typeof FormData]?.fields.map(
                  (field, index) => (
                    <GeneralForm
                      key={`${index}_${field.name}`}
                      field={field}
                      control={control}
                      errors={errors}
                    />
                  )
                )}

                {expenseType &&
                  getDefaultFormData(expenseType).map((field: any) => (
                    <GeneralForm
                      field={field}
                      control={control}
                      errors={errors}
                    />
                  ))}
                <Controller
                  control={control}
                  name="files"
                  rules={{
                    required: isReceiptRequired
                      ? "Please upload receipts"
                      : false,
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

              <View className="flex-row justify-between mt-5 fontFamily-sf">
                <TouchableOpacity
                  className="flex-1 mr-2 p-2.5 rounded-lg bg-gray-100 h-[56px] flex items-center justify-center"
                  onPress={handleBack}
                >
                  <Text className="text-gray-600 text-lg text-center font-sfpro font-medium">
                    Back
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 ml-2 p-2.5 rounded-lg bg-blue-900 h-[56px] flex items-center justify-center"
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text className="text-white text-lg text-center font-sfpro font-medium">
                    Add expense
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SwipeToCloseDrawer>
      </DefaultModal>
    </View>
  );
}
