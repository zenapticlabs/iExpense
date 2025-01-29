import { commonService } from "@/services/commonService";
import { reportService } from "@/services/reportService";
import { Styles } from "@/Styles";
import { ReportTypes } from "@/utils/UtilData";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface TelephoneCellProps {
  payload: any;
  setPayload: any;
  errors: any;
}

export default function TelephoneCell({
  payload,
  setPayload,
  errors,
}: TelephoneCellProps) {
  useEffect(() => {
    setPayload({
      ...payload,
      carrier: "",
    });
  }, []);
  return (
    <View style={styles.formContainer}>
      <View>
        <Text style={Styles.generalInputLabel}>Carrier</Text>
        <TextInput
          style={Styles.generalInput}
          placeholder="Enter Carrier"
          onChangeText={(text) => setPayload({ ...payload, carrier: text })}
        />
        {errors?.carrier && (
          <Text className="text-red-500 pl-4 mt-1">{errors?.carrier}</Text>
        )}
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  formContainer: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 16,
    color: "#1E1E1E",
    marginBottom: 4,
  },
  dropdown: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    width: "100%",
  },
  dropdownContainer: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
});
