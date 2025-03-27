import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Text, View, TextInput, Pressable, TouchableOpacity,Image } from "react-native";
import GeneralDropdown from "./GeneralDropdown";
import DefaultModal from "../DefaultModal";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import "react-datepicker/dist/react-datepicker.css";
import { formatDate } from "@/utils/UtilFunctions";

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
      <View className="relative">
        {
          field.type == "date" && (
            <Image
          source={require("@/assets/images/CalendarBlank.svg")}
          className="absolute right-[10px] top-[10px]"
          resizeMode="contain"
        />
          )
        }

        <Controller
          control={control}
          name={field.name}
          rules={{
            required: field.required ? `${field.label} is required` : false,
          }}
          defaultValue={
            field.type === "date"
              ? dayjs().format("YYYY-MM-DD")
              : field.defaultValue
              ? field.defaultValue
              : ""
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
                  className="border border-[#ccc] rounded-lg font-sfpro text-base text-[#1E1E1E] px-4 py-3"
                  style={{
                    lineHeight: 18,
                    minHeight: field.multiline ? 80 : undefined,
                  }}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  editable={!disabled}
                  value={value}
                  keyboardType={field.type === "number" ? "numeric" : "default"}
                  secureTextEntry={field.type === "password"}
                  multiline={field.multiline || false}
                  numberOfLines={field.multiline ? 2 : 1}
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
              const [defaultDate, setDefaultDate] = useState(
                dayjs(value || new Date())
              );
              const [selectedDate, setSelectedDate] = useState(
                dayjs(value || new Date())
              );

              useEffect(() => {
                if (value) {
                  setDefaultDate(dayjs(value));
                }
              }, [value]);

              const setDate = (newValue: any) => {
                if (newValue) {
                  const formattedDate = dayjs(newValue).format("YYYY-MM-DD");
                  setSelectedDate(dayjs(formattedDate));
                }
              };

              const handleDateConfirm = () => {
                onChange(selectedDate);
                setShowDatePicker(false);
              };

              const handleClose = () => {
                setSelectedDate(defaultDate);
                setShowDatePicker(false);
              };

              return (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <View>
                    <TouchableOpacity
                      className="border border-[#ccc] rounded-lg font-sfpro text-base text-[#1E1E1E] px-4 py-2.5"
                      onPress={() => {
                        if (!disabled) {
                          setShowDatePicker(true);
                        }
                      }}
                    >
                      <Text className="font-sfpro text-base font-medium text-[#1E1E1E]">
                        {formatDate(selectedDate.format("YYYY-MM-DD"))}
                      </Text>
                    </TouchableOpacity>

                    {showDatePicker && (
                      <DefaultModal
                        isVisible={showDatePicker}
                        onClose={handleClose}
                      >
                        <View
                          className="bg-white rounded-lg p-4"
                          style={{ minHeight: 250 }}
                        >
                          <DateCalendar
                            views={["year", "month", "day"]}
                            value={selectedDate}
                            onChange={setDate}
                            disableFuture
                            className="w-full"
                          />
                        </View>
                        <View className="flex-row justify-between px-8">
                          <TouchableOpacity
                            className="flex-1 mr-2 p-2.5 rounded-lg bg-gray-100"
                            onPress={handleClose}
                          >
                            <Text className="text-gray-600 text-lg text-center font-sfpro font-medium">
                              Cancel
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="flex-1 ml-2 p-2.5 rounded-lg bg-blue-900"
                            onPress={handleDateConfirm}
                          >
                            <Text className="text-white text-lg text-center font-sfpro font-medium">
                              Confirm Date
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </DefaultModal>
                    )}
                  </View>
                </LocalizationProvider>
              );
            }
            return <Text>None</Text>;
          }}
        />
      </View>

      {errors[field.name] && (
        <Text style={{ color: "red" }}>
          {errors[field.name]?.message?.toString()}
        </Text>
      )}
    </View>
  );
}
