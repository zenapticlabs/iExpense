import { commonService } from "@/services/commonService";
import { Styles } from "@/Styles";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface AirFareProps {
  payload: any;
  setPayload: any;
  errors: any;
}

export default function AirFare({ payload, setPayload, errors }: AirFareProps) {
  const [airlines, setAirlines] = useState<any[]>([]);
  useEffect(() => {
    setPayload({
      ...payload,
      airline: payload?.airline || "",
      origin_destination: payload?.origin_destination || "",
    });
  }, []);
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
      <View>
        <Text style={Styles.generalInputLabel}>Airline</Text>
        <Dropdown
          data={airlines}
          labelField="label"
          valueField="value"
          onChange={(item) => setPayload({ ...payload, airline: item.value })}
          value={payload?.airline}
          style={Styles.generalInput}
          containerStyle={styles.dropdownContainer}
        />
        {errors?.airline && (
          <Text className="text-red-500 pl-4 mt-1">{errors?.airline}</Text>
        )}
      </View>
      <View>
        <Text style={Styles.generalInputLabel}>Origin</Text>
        <TextInput
          style={Styles.generalInput}
          placeholder="Enter origin"
          value={payload?.origin_destination}
          onChangeText={(text) =>
            setPayload({ ...payload, origin_destination: text })
          }
        />
        {errors?.origin_destination && (
          <Text className="text-red-500 pl-4 mt-1">
            {errors?.origin_destination}
          </Text>
        )}
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  formContainer: {
    gap: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: "#1E1E1E",
  },
  dropdown: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
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
    fontSize: 16,
  },
});
