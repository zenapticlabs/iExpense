import { commonService } from "@/services/commonService";
import { reportService } from "@/services/reportService";
import { Styles } from "@/Styles";
import { ReportTypes } from "@/utils/UtilData";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface MileageProps {
  payload: any;
  setPayload: any;
  errors: any;
}

export default function Mileage({ payload, setPayload, errors }: MileageProps) {
  const [mileageRates, setMileageRates] = useState<any[]>([]);
  useEffect(() => {
    setPayload({
      ...payload,
      origin_destination: "",
      destination: "",
      distance: "",
      mileage_rate: "",
    });
  }, []);
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
      <View>
        <Text style={Styles.generalInputLabel}>Origin</Text>
        <TextInput
          style={Styles.generalInput}
          placeholder="Enter Origin"
          onChangeText={(text) =>
            setPayload({ ...payload, origin_destination: text })
          }
        />
        {errors?.origin_destination && (
          <Text className="text-red-500 pl-4 mt-1">{errors?.origin_destination}</Text>
        )}
      </View>
      <View>
        <Text style={Styles.generalInputLabel}>Destination</Text>
        <TextInput
          style={Styles.generalInput}
          placeholder="Enter Destination"
          onChangeText={(text) => setPayload({ ...payload, destination: text })}
        />
        {errors?.destination && (
          <Text className="text-red-500 pl-4 mt-1">{errors?.destination}</Text>
        )}
      </View>
      <View>
        <Text style={Styles.generalInputLabel}>Distance</Text>
        <TextInput
          style={Styles.generalInput}
          placeholder="Enter Distance"
          onChangeText={(text) => setPayload({ ...payload, distance: text })}
        />
        {errors?.distance && (
          <Text className="text-red-500 pl-4 mt-1">{errors?.distance}</Text>
        )}
      </View>
      <View>
        <Text style={Styles.generalInputLabel}>Mileage Rate</Text>
        <Dropdown
          data={mileageRates}
          labelField="label"
          valueField="value"
          onChange={(item) =>
            setPayload({ ...payload, mileage_rate: item.value })
          }
          style={Styles.generalInput}
          containerStyle={styles.dropdownContainer}
        />
        {errors?.mileage_rate && (
          <Text className="text-red-500 pl-4 mt-1">{errors?.mileage_rate}</Text>
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
