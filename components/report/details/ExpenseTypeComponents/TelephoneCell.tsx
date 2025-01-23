import { commonService } from "@/services/commonService";
import { reportService } from "@/services/reportService";
import { ReportTypes } from "@/utils/UtilData";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface TelephoneCellProps {
  payload: any;
  setPayload: any;
}

export default function TelephoneCell({
  payload,
  setPayload,
}: TelephoneCellProps) {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.inputLabel}>Carrier</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Carrier"
        onChangeText={(text) => setPayload({ ...payload, carrier: text })}
      />
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
