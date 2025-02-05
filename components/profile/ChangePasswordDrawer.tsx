import { View, Text, TouchableOpacity } from "react-native";
import DefaultModal from "../DefaultModal";
import { useForm } from "react-hook-form";
import GeneralForm from "../GeneralForms/GeneralForm";
import { authService } from "@/services/authService";
import { useEffect } from "react";

interface ChangePasswordDrawerProps {
  isVisible: boolean;
  onClose: () => void;
}

const FormFields = [
  {
    name: "old_password",
    label: "Old password",
    type: "password",
    required: true,
  },
  {
    name: "new_password",
    label: "New password",
    type: "password",
    required: true,
  },

  {
    name: "confirm_password",
    label: "Confirm password",
    type: "password",
    required: true,
  },
];

export default function ChangePasswordDrawer({
  isVisible,
  onClose,
}: ChangePasswordDrawerProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    mode: "onChange",
  });

  const handleSave = handleSubmit(async (data) => {
    try {
      if (data.new_password !== data.confirm_password) {
        setError("confirm_password", {
          message: "Passwords do not match",
        });
        return;
      }
      await authService.changePassword(data.old_password, data.new_password);
      onClose();
    } catch (error: any) {
      setError("old_password", { message: "Incorrect current password." });
    }
  });

  useEffect(() => {
    reset();
  }, [isVisible]);

  return (
    <DefaultModal isVisible={isVisible} onClose={onClose}>
      <View className="flex-1 bg-white px-4 py-4">
        <Text className="text-2xl font-sfpro font-bold text-[#1E1E1E] mb-4">
          Change password
        </Text>
        {FormFields.map((field) => (
          <GeneralForm field={field} control={control} errors={errors} />
        ))}
      </View>
      <View className="flex-row justify-between mt-5 px-4">
        <TouchableOpacity
          className="flex-1 mr-2 px-4 py-2.5 rounded-lg bg-gray-100"
          onPress={onClose}
        >
          <Text className="text-gray-600 text-lg text-center font-sfpro font-medium">
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 ml-2 px-4 py-2.5 rounded-lg bg-blue-900"
          onPress={handleSave}
        >
          <Text className="!text-white text-lg text-center font-sfpro font-medium">
            Change
          </Text>
        </TouchableOpacity>
      </View>
    </DefaultModal>
  );
}
