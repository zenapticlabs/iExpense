import { commonService } from "@/services/commonService";
import { Styles } from "@/Styles";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import GeneralDropdown from "./GeneralDropdown";
import DefaultModal from "../DefaultModal";
import { formatDate } from "@/utils/UtilFunctions";
import { Calendar } from "react-native-calendars";

interface GeneralFormProps {
  field: any;
  control: any;
  errors: any;
  disabled?: boolean;
}

export default function GeneralForm({
  field,
  control,
  errors,
  disabled,
}: GeneralFormProps) {
  return (
    <View key={field.name} style={{ marginBottom: 10 }}>
      <Text className="font-sfpro text-base font-medium text-[#1E1E1E] mb-1">
        {field.label}
        {field.required && <Text className="text-red-500">*</Text>}
      </Text>
      <Controller
        control={control}
        name={field.name}
        rules={{
          required: field.required ? `${field.label} is required` : false,
        }}
        defaultValue={
          field.type === "date" ? new Date().toISOString().split("T")[0] : ""
        }
        render={({ field: { onChange, onBlur, value } }) => {
          if (
            field.type === "text" ||
            field.type === "email" ||
            field.type === "number" ||
            field.type === "password"
          ) {
            return (
              <TextInput
                className="border border-[#ccc] rounded-lg font-sfpro text-base text-[#1E1E1E] px-4 py-2.5"
                onBlur={onBlur}
                onChangeText={onChange}
                editable={!disabled}
                value={value}
                keyboardType={field.type === "number" ? "numeric" : "default"}
                secureTextEntry={field.type === "password"}
              />
            );
          }
          if (field.type === "dropdown") {
            return (
              <GeneralDropdown
                resource={field.resource}
                value={value}
                onChange={onChange}
                defaultOptions={field?.options}
                disabled={disabled}
              />
            );

          }

          if (field.type === "date") {
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
                    if (!disabled) {
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
          }
          return <Text>None</Text>;
        }}
      />
      {errors[field.name] && (
        <Text style={{ color: "red" }}>
          {errors[field.name]?.message?.toString()}
        </Text>
      )}
    </View>
  );
}
