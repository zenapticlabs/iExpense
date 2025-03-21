import { useEffect, useRef, useState } from "react";
import { Text, View, Pressable, Modal, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { reportService } from "@/services/reportService";
import UploadDrawer, { FileAsset } from "@/components/report/details/UploadDrawer";

interface GeneralUploadFormProps {
  reportId?: string;
  expenseId?: string;
  onChange: (files: any[]) => void;
  value: any[];
  errors: any;
  required: boolean;
  disabled?: boolean;
  setValue?: any;
}

export default function GeneralUploadForm({
  reportId,
  expenseId,
  onChange,
  value = [],
  errors,
  required,
  disabled,
}: GeneralUploadFormProps) {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [selectedFileUri, setSelectedFileUri] = useState<string>("");
  const [presignedUrls, setPresignedUrls] = useState<any[]>([]);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!reportId || !expenseId || hasFetched.current) return;

    hasFetched.current = true;

    const fetchReceipt = async () => {
      try {
        const response = await reportService.downloadReceipt(reportId, expenseId);
        setPresignedUrls(response);
      } catch (error) {
        console.error("Error fetching receipts:", error);
      }
    };

    fetchReceipt();
  }, [reportId, expenseId]);

  useEffect(() => {
    if (value && JSON.stringify(value) !== JSON.stringify(receipts)) {
      setReceipts(value);
    }
  }, [value]);
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handlePreviewModal = async (file: any) => {
    setSelectedFileUri(getFileUri(file));
    setIsPreviewModalVisible(true);
  };

  const getFileUri = (file: any) => {
    if (file?.filename) {
      return presignedUrls.find((uploadedFile) => uploadedFile.filename === file.filename)?.presigned_url
    }
    return file?.uri || ""
  }

  const handleRemoveFile = (fileToRemove: any) => {
    const newFiles = receipts.filter((file) => {
      if (file.id) {
        return file.id !== fileToRemove.id;
      }
      return file.name !== fileToRemove.name;
    });
    setReceipts(newFiles);
    onChange(newFiles);
  };

  const onFileAdded = (file: FileAsset) => {
    const newFiles = [...receipts, file];
    setReceipts(newFiles);
    onChange(newFiles);
  }

  return (
    <View className="mb-4">
      <Text className="font-sfpro text-base font-medium text-[#1E1E1E] mb-1">
        Attached Receipt {required && <Text className="text-red-500">*</Text>}
      </Text>

      {receipts.length > 0 ? (
        receipts.map((receipt, index) => (
          <Pressable
            key={index}
            onPress={() => handlePreviewModal(receipt)}
            className="flex flex-row items-center p-3 bg-gray-100 rounded-lg mb-2 active:bg-gray-200"
          >
            <View className="w-10 h-10 rounded-lg bg-white justify-center items-center">
              <Ionicons name="document-outline" size={24} color="#666" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-sm text-[#1e1e1e] font-medium">
                {receipt.filename || receipt.name}
              </Text>
              {receipt.size && (
                <Text className="text-xs text-[#666666] mt-0.5">{formatFileSize(receipt.size)}</Text>
              )}
            </View>
            {!disabled && (
              <Ionicons
                name="close-circle-outline"
                size={24}
                color="#666"
                onPress={() => handleRemoveFile(receipt)}
              />
            )}
          </Pressable>
        ))
      ) : null}

      {!disabled && <UploadDrawer onChange={onFileAdded} enableUpload={true} />}

      {errors.file && <Text className="text-red-500">{errors.file?.message?.toString()}</Text>}

      <Modal animationType="fade" transparent={true} visible={isPreviewModalVisible} onRequestClose={() => setIsPreviewModalVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black/50 absolute h-full w-full z-50">
          <View className="m-5 bg-white rounded-lg p-6 items-start shadow-lg w-[95%] z-50 h-5/6">
            <Text className="text-[22px] font-bold text-[#1e1e1e] leading-[26px] w-full pb-4">Uploaded Receipt</Text>
            {selectedFileUri ? (
              <View className="min-h-[200px] w-full rounded-lg my-2.5 justify-center items-center h-5/6">
                <Image source={{ uri: selectedFileUri }} className="w-full h-full rounded-lg" resizeMode="contain" />
              </View>
            ) : null}

            <View className="absolute bottom-0 left-0 right-0 p-4">
              <Pressable
                className="rounded-lg py-4 bg-[#F5F5F5] justify-center w-full items-center"
                onPress={() => setIsPreviewModalVisible(false)}
              >
                <Text className="text-[#1E1E1E] font-medium text-center text-[17px]">Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
