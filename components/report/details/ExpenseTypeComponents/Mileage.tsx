import { commonService } from "@/services/commonService";
import { reportService } from "@/services/reportService";
import { ReportTypes } from "@/utils/UtilData";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface MileageProps {
  payload: any;
  setPayload: any;
}

export default function Mileage({ payload, setPayload }: MileageProps) {
  const [mileageRates, setMileageRates] = useState<any[]>([]);
  useEffect(() => {
    const fetchMileageRates = async () => {
      try {
        const response = await commonService.getMileageRates();
        setMileageRates(
          response.map((item: any) => ({
            label: item.value,
            value: item.value,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch airlines:", error);
      }
    };
    fetchMileageRates();
  }, []);
  return (
    <View style={styles.formContainer}>
      <Text style={styles.inputLabel}>Origin</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Origin"
        onChangeText={(text) =>
          setPayload({ ...payload, origin_destination: text })
        }
      />
      <Text style={styles.inputLabel}>Destination</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Destination"
        onChangeText={(text) => setPayload({ ...payload, destination: text })}
      />
      <Text style={styles.inputLabel}>Distance</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Distance"
        onChangeText={(text) => setPayload({ ...payload, distance: text })}
      />
      <Text style={styles.inputLabel}>Mileage Rate</Text>
      <Dropdown
        data={mileageRates}
        labelField="label"
        valueField="value"
        onChange={(item) =>
          setPayload({ ...payload, mileage_rate: item.value })
        }
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  formContainer: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    color: "#1E293B",
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
