import { commonService } from "@/services/commonService";
import { Styles } from "@/Styles";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  Modal,
  Image,
} from "react-native";
import CurrencyDropdown from "@/components/CurrencyDropdown";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import WebView from "react-native-webview";
import { reportService } from "@/services/reportService";

interface GeneralUploadFormProps {
  reportId?: string;
  formValues?: any;
  onChange: any;
  value: any;
  errors: any;
  required: boolean;
}

export default function GeneralUploadForm({
  reportId,
  formValues,
  onChange,
  value,
  errors,
  required,
}: GeneralUploadFormProps) {
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isImageFile = (file: any) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];
    if (
      file?.mimeType?.startsWith("image/") ||
      file?.type?.startsWith("image/")
    ) {
      return true;
    }
    if (file?.name) {
      const extension = file.name.toLowerCase().match(/\.[^.]*$/)?.[0];
      return extension && imageExtensions.includes(extension);
    }
    if (typeof file === "string") {
      const extension = file.toLowerCase().match(/\.[^.]*$/)?.[0];
      return extension && imageExtensions.includes(extension);
    }
    return false;
  };

  const isPdfFile = (file: any) => {
    if (
      file?.mimeType === "application/pdf" ||
      file?.type === "application/pdf"
    ) {
      return true;
    }
    if (file?.name) {
      const extension = file.name.toLowerCase().match(/\.[^.]*$/)?.[0];
      return extension === ".pdf";
    }
    if (typeof file === "string") {
      const extension = file.toLowerCase().match(/\.[^.]*$/)?.[0];
      return extension === ".pdf";
    }
    return false;
  };

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"], // Allows images and PDFs
        multiple: false,
      });

      if (result.assets && result.assets[0]) {
        const file = result.assets[0];
        onChange(file);
      }
    } catch (err) {
      console.error("Error picking document:", err);
    }
  };
  const handlePreviewModal = async () => {
    setIsPreviewModalVisible(true);
    if (reportId) {
      const response = await reportService.downloadReceipt(reportId, formValues?.id);
      console.log(response.presigned_url);
    }
  };
  return (
    <View className="mb-4">
      <Text className="font-sfpro text-base font-medium text-[#1E1E1E] mb-1">
        Attached Receipt
        {required && <Text className="text-red-500">*</Text>}
      </Text>
      {formValues?.filename && (
        <Pressable
          onPress={handlePreviewModal}
          className="flex flex-row items-center p-3 bg-gray-100 rounded-lg mb-2 active:bg-gray-200"
        >
          <View className="w-10 h-10 rounded-lg bg-white justify-center items-center">
            <Ionicons name="document-outline" size={24} color="#666" />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-sm text-[#1e1e1e] font-medium">
              {formValues?.filename}
            </Text>
          </View>
          <Ionicons
            name="close-circle-outline"
            size={24}
            color="#666"
            onPress={() => onChange(null)}
          />
        </Pressable>
      )}
      {value && (
        <Pressable
          onPress={() => setIsPreviewModalVisible(true)}
          className="flex flex-row items-center p-3 bg-gray-100 rounded-lg mb-2 active:bg-gray-200"
        >
          <View className="w-10 h-10 rounded-lg bg-white justify-center items-center">
            <Ionicons name="document-outline" size={24} color="#666" />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-sm text-[#1e1e1e] font-medium">
              {value.name}
            </Text>
            <Text className="text-xs text-[#666666] mt-0.5">
              {formatFileSize(value.size)}
            </Text>
          </View>
          <Ionicons
            name="close-circle-outline"
            size={24}
            color="#666"
            onPress={() => onChange(null)}
          />
        </Pressable>
      )}
      <TouchableOpacity
        className="flex p-6 items-center justify-center border border-[#ccc] rounded-lg border-dashed rounded-lg"
        onPress={handleUpload}
      >
        <Ionicons name="cloud-upload-outline" size={24} color="#666" />
        <Text className="text-base text-[#666] mt-2">Upload file</Text>
      </TouchableOpacity>
      {errors.file && (
        <Text className="text-red-500">{errors.file?.message?.toString()}</Text>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isPreviewModalVisible}
        onRequestClose={() => setIsPreviewModalVisible(!isPreviewModalVisible)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 absolute h-full w-full z-50">
          <View className="m-5 bg-white rounded-lg p-6 items-start shadow-lg w-[95%] z-50">
            <Text className="text-[22px] font-bold text-[#1e1e1e] leading-[26px] w-full font-['SFProDisplay'] pb-4">
              Uploaded receipt
            </Text>
            {value && (
              <View className="min-h-[200px] w-full rounded-lg my-2.5 justify-center items-center">
                {isImageFile(value) ? (
                  <Image
                    source={{ uri: value.uri }}
                    className="w-full h-full rounded-lg"
                    resizeMode="contain"
                  />
                ) : isPdfFile(value) ? (
                  <WebView
                    source={{ uri: value.uri }}
                    className="w-full h-[400px] rounded-lg"
                    javaScriptEnabled={true}
                  />
                ) : (
                  <View>
                    <Ionicons name="document-outline" size={40} color="#666" />
                    <Text className="text-base text-[#1e1e1e] mt-2">
                      {value.name}
                    </Text>
                    <Text className="text-xs text-[#666666] mt-0.5">
                      {formatFileSize(value.size)}
                    </Text>
                  </View>
                )}
              </View>
            )}
            <View className="flex flex-row justify-between w-full mt-4 gap-4 items-center">
              <Pressable
                className="flex-1 rounded-lg py-5 bg-[#F5F5F5] justify-center items-center"
                onPress={() => setIsPreviewModalVisible(false)}
              >
                <Text className="text-[#1E1E1E] font-medium text-center text-[17px] font-['SFProDisplay']">
                  Close
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
