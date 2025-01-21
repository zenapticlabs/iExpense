import { commonService } from "@/services/commonService";
import { reportService } from "@/services/reportService";
import { ReportTypes } from "@/utils/UtilData";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface AirFareProps {
  payload: any;
  setPayload: any;
}

export default function AirFare({ payload, setPayload }: AirFareProps) {
  const [airlines, setAirlines] = useState<any[]>([]);
  useEffect(() => {
    const fetchAirlines = async () => {
      try {
        const response = await commonService.getAirlines();
        setAirlines(
          response.map((item: any) => ({
            label: item.value,
            value: item.value,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch airlines:", error);
      }
    };
    fetchAirlines();
  }, []);
  return (
    <View style={styles.formContainer}>
      <Text style={styles.inputLabel}>Airline</Text>
      <Dropdown
        data={airlines}
        labelField="label"
        valueField="value"
        onChange={(item) =>
          setPayload({ ...payload, airline: item.value })
        }
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
      />
      <Text style={styles.inputLabel}>Origin</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter origin"
        onChangeText={(text) =>
          setPayload({ ...payload, origin_destination: text })
        }
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
