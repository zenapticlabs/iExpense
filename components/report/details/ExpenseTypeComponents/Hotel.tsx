import { commonService } from "@/services/commonService";
import { reportService } from "@/services/reportService";
import { ReportTypes } from "@/utils/UtilData";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface HotelProps {
  payload: any;
  setPayload: any;
}

export default function Hotel({ payload, setPayload }: HotelProps) {
  const [cities, setCities] = useState<any[]>([]);
  const [hotelDailyBaseRates, setHotelDailyBaseRates] = useState<any[]>([]);
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await commonService.getCities();
        setCities(
          response.map((item: any) => ({
            label: item.value,
            value: item.value,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch airlines:", error);
      }
    };
    const fetchHotelDailyBaseRates = async () => {
      try {
        const response = await commonService.getHotelDailyBaseRates();
        setHotelDailyBaseRates(response);
      } catch (error) {
        console.error("Failed to fetch hotel daily base rate:", error);
      }
    };
    fetchCities();
    fetchHotelDailyBaseRates();
  }, []);
  return (
    <View style={styles.formContainer}>
      <Text style={styles.inputLabel}>Hotel Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Hotel Name"
        onChangeText={(text) => setPayload({ ...payload, hotel_name: text })}
      />
      <Text style={styles.inputLabel}>City</Text>
      <Dropdown
        data={cities}
        labelField="label"
        valueField="value"
        onChange={(item) => setPayload({ ...payload, city: item.value })}
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
