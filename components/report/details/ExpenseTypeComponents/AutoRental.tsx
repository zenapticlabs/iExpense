import { commonService } from "@/services/commonService";
import { reportService } from "@/services/reportService";
import { Styles } from "@/Styles";
import { ReportTypes } from "@/utils/UtilData";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface AutoRentalProps {
  payload: any;
  setPayload: any;
  errors: any;
}

export default function AutoRental({ payload, setPayload, errors }: AutoRentalProps) {
  const [carTypes, setCarTypes] = useState<any[]>([]);
  const [rentalAgencies, setRentalAgencies] = useState<any[]>([]);
  useEffect(() => {
    setPayload({
      ...payload,
      car_type: "",
      rental_agency: "",
    });
  }, []);
  useEffect(() => {
    const fetchCarTypes = async () => {
      try {
        const response = await commonService.getCarTypes();
        setCarTypes(
          response.map((item: any) => ({
            label: item.value,
            value: item.value,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch airlines:", error);
      }
    };
    const fetchRentalAgencies = async () => {
      try {
        const response = await commonService.getRentalAgencies();
        setRentalAgencies(
          response.map((item: any) => ({
            label: item.value,
            value: item.value,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch rental agencies:", error);
      }
    };
    fetchCarTypes();
    fetchRentalAgencies();
  }, []);
  return (
    <View style={styles.formContainer}>
      <View>
        <Text style={Styles.generalInputLabel}>Car Type</Text>
        <Dropdown
          data={carTypes}
          labelField="label"
          valueField="value"
          onChange={(item) => setPayload({ ...payload, car_type: item.value })}
          style={Styles.generalInput}
          containerStyle={styles.dropdownContainer}
        />
        {errors?.car_type && (
          <Text className="text-red-500 pl-4 mt-1">{errors?.car_type}</Text>
        )}
      </View>
      <View>
        <Text style={Styles.generalInputLabel}>Rental Agency</Text>
        <Dropdown
          data={rentalAgencies}
          labelField="label"
          valueField="value"
          onChange={(item) =>
            setPayload({ ...payload, rental_agency: item.value })
          }
          style={Styles.generalInput}
          containerStyle={styles.dropdownContainer}
        />
        {errors?.rental_agency && (
          <Text className="text-red-500 pl-4 mt-1">{errors?.rental_agency}</Text>
        )}
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  formContainer: {
    gap: 16,
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
