import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, GestureResponderEvent } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

// Define a type for the file object
interface FileAsset {
  uri: string;
  name?: string;
  size?: number;
  type?: string;
}

// Define props type
interface UploadComponentProps {
  onChange: (file: FileAsset) => void;
  enableUpload: boolean
}

export default function UploadComponent({ onChange, enableUpload }: UploadComponentProps) {
  const [isUploadModalVisible, setIsUploadModalVisible] = useState<boolean>(false);

  // Function to handle opening the modal
  const handleUpload = (event: GestureResponderEvent): void => {
    event.preventDefault();
    setIsUploadModalVisible(true);
  };

  // Function to take a picture using the camera
  const takePicture = async (): Promise<void> => {
    setIsUploadModalVisible(false); // Close modal before opening camera

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Camera permission is required to take a picture.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const file: FileAsset = {
        uri: result.assets[0].uri,
        name: result.assets[0].fileName || "captured-image.jpg",
        size: result.assets[0].fileSize || 0,
        type: result.assets[0].mimeType || "image/jpeg",
      };
      onChange(file);
    }
  };

  // Function to pick a file
  const pickFile = async (): Promise<void> => {
    setIsUploadModalVisible(false); // Close modal before opening file picker

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        multiple: false,
      });

      if (result.assets && result.assets.length > 0) {
        const file: FileAsset = {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          size: result.assets[0].size,
          type: result.assets[0].mimeType,
        };
        onChange(file);
      }
    } catch (err) {
      console.error("Error picking document:", err);
    }
  };

  return (
    <View>
      {/* Show Upload Button Only If No File Exists */}
      {enableUpload && (
        <TouchableOpacity className="flex p-6 items-center justify-center border border-[#ccc] rounded-lg border-dashed" onPress={handleUpload}>
          <Ionicons name="cloud-upload-outline" size={24} color="#666" />
          <Text className="text-base text-[#666] mt-2">Upload file</Text>
        </TouchableOpacity>
      )}

      {/* Bottom Drawer Modal */}
      <Modal animationType="slide" transparent={true} visible={isUploadModalVisible} onRequestClose={() => setIsUploadModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white p-6 rounded-t-lg">
            <Text className="text-lg font-medium text-center mb-4">Choose an Option</Text>

            {/* Take Picture */}
            <TouchableOpacity className="p-4 flex-row items-center border-b border-gray-300" onPress={takePicture}>
              <Ionicons name="camera-outline" size={24} color="#666" className="mr-3" />
              <Text className="text-base">Take a Picture</Text>
            </TouchableOpacity>

            {/* Pick a File */}
            <TouchableOpacity className="p-4 flex-row items-center border-b border-gray-300" onPress={pickFile}>
              <Ionicons name="document-outline" size={24} color="#666" className="mr-3" />
              <Text className="text-base">Pick a File</Text>
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity className="p-4 flex-row items-center justify-center" onPress={() => setIsUploadModalVisible(false)}>
              <Text className="text-base text-red-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
