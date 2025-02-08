import { useState } from "react";
import { Text, View, Pressable, Modal, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import WebView from "react-native-webview";
import { reportService } from "@/services/reportService";
import UploadDrawer from "@/components/report/details/UploadDrawer";

interface GeneralUploadFormProps {
  reportId?: string;
  formValues?: any;
  onChange: (file: any) => void;
  value: any;
  errors: any;
  required: boolean;
  disabled?: boolean;
  setValue?: any;
}

export default function GeneralUploadForm({
  reportId,
  formValues,
  onChange,
  value,
  errors,
  required,
  disabled,
  setValue,
}: GeneralUploadFormProps) {
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const isImageFile = (file: any) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];

    if (typeof file === "string") {
      const urlWithoutParams = file.split("?")[0]; // Remove query params
      const extension = urlWithoutParams.toLowerCase().match(/\.[^.]*$/)?.[0];
      return extension && imageExtensions.includes(extension);
    }

    return file?.mimeType?.startsWith("image/") || file?.type?.startsWith("image/");
  };

  const isPdfFile = (file: any) =>
    file?.mimeType === "application/pdf" || file?.type === "application/pdf";

  const handlePreviewModal = async () => {
    setIsPreviewModalVisible(true);
    if (reportId) {
      const response = await reportService.downloadReceipt(reportId, formValues?.id);
      setUploadedFileUrl(response.presigned_url);
      console.log(isImageFile(response.presigned_url))
      console.log(isPdfFile(response.presigned_url))
      console.log(value)
    }
  };

  const handleRemoveFile = () => {
    onChange(null);
    setValue?.("filename", null);
    setValue?.("s3_path", null);
    setValue?.("presigned_url", null);
  };

  return (
    <View className="mb-4">
      <Text className="font-sfpro text-base font-medium text-[#1E1E1E] mb-1">
        Attached Receipt {required && <Text className="text-red-500">*</Text>}
      </Text>

      {value ? (
        <Pressable onPress={() => setIsPreviewModalVisible(true)} className="flex flex-row items-center p-3 bg-gray-100 rounded-lg mb-2 active:bg-gray-200">
          <View className="w-10 h-10 rounded-lg bg-white justify-center items-center">
            <Ionicons name="document-outline" size={24} color="#666" />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-sm text-[#1e1e1e] font-medium">{value.name}</Text>
            <Text className="text-xs text-[#666666] mt-0.5">{formatFileSize(value.size)}</Text>
          </View>
          {!disabled && <Ionicons name="close-circle-outline" size={24} color="#666" onPress={handleRemoveFile} />}
        </Pressable>
      ) : !value && formValues?.filename ? (
        <Pressable onPress={handlePreviewModal} className="flex flex-row items-center p-3 bg-gray-100 rounded-lg mb-2 active:bg-gray-200">
          <View className="w-10 h-10 rounded-lg bg-white justify-center items-center">
            <Ionicons name="document-outline" size={24} color="#666" />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-sm text-[#1e1e1e] font-medium">{formValues?.filename}</Text>
          </View>
          {!disabled && <Ionicons name="close-circle-outline" size={24} color="#666" onPress={handleRemoveFile} />}
        </Pressable>
      ) : null}

      {!disabled && <UploadDrawer onChange={onChange} enableUpload={!value && !formValues?.filename} />}

      {errors.file && <Text className="text-red-500">{errors.file?.message?.toString()}</Text>}

      {/* 📌 Modal for File Preview */}
      <Modal animationType="fade" transparent={true} visible={isPreviewModalVisible} onRequestClose={() => setIsPreviewModalVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black/50 absolute h-full w-full z-50">
          <View className="m-5 bg-white rounded-lg p-6 items-start shadow-lg w-[95%] z-50 h-5/6">
            <Text className="text-[22px] font-bold text-[#1e1e1e] leading-[26px] w-full pb-4">Uploaded Receipt</Text>

            {value ? (
              <View className="min-h-[200px] w-full rounded-lg my-2.5 justify-center items-center h-5/6">
                {isImageFile(value) ? (
                  <Image source={{ uri: value.uri }} className="w-full h-full rounded-lg" resizeMode="contain" />
                ) : isPdfFile(value) ? (
                  <WebView source={{ uri: value.uri }} className="w-full h-[400px] rounded-lg" javaScriptEnabled={true} />
                ) : null}
              </View>
            ) : !value && uploadedFileUrl ? (
              <View className="min-h-[200px] w-full rounded-lg my-2.5 justify-center items-center h-5/6">
                {isImageFile(uploadedFileUrl) ? (
                  <Image source={{ uri: uploadedFileUrl }} className="w-full h-full rounded-lg" resizeMode="contain" onError={(error) => console.log("Image Load Error:", error.nativeEvent.error)}
                  />
                ) : isPdfFile(uploadedFileUrl) ? (
                  <WebView source={{ uri: uploadedFileUrl }} className="w-full h-[400px] rounded-lg" javaScriptEnabled={true} />
                ) : null}
              </View>
            ) : null}

            <Pressable className="flex-1 rounded-lg py-5 bg-[#F5F5F5] justify-center w-full items-center mt-4" onPress={() => setIsPreviewModalVisible(false)}>
              <Text className="text-[#1E1E1E] font-medium text-center text-[17px]">Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
