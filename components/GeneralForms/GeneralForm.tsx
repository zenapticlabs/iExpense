import { commonService } from "@/services/commonService";
import { Styles } from "@/Styles";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import GeneralDropdown from "./GeneralDropdown";

interface GeneralFormProps {
  field: any;
  control: any;
  errors: any;
}

export default function GeneralForm({
  field,
  control,
  errors,
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
              />
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
