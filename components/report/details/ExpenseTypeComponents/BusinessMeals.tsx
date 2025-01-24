import { commonService } from "@/services/commonService";
import { reportService } from "@/services/reportService";
import { Styles } from "@/Styles";
import { ReportTypes } from "@/utils/UtilData";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface BusinessMealsProps {
  payload: any;
  setPayload: any;
}

export default function BusinessMeals({
  payload,
  setPayload,
}: BusinessMealsProps) {
  const [mealCategories, setMealCategories] = useState<any[]>([]);
  useEffect(() => {
    const fetchMealCategories = async () => {
      try {
        const response = await commonService.getMealCategories();
        setMealCategories(
          response.map((item: any) => ({
            label: item.value,
            value: item.value,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch airlines:", error);
      }
    };
    fetchMealCategories();
  }, []);
  return (
    <View style={styles.formContainer}>
      <View>
        <Text style={Styles.generalInputLabel}>Meal Category</Text>
        <Dropdown
          data={mealCategories}
          labelField="label"
          valueField="value"
          onChange={(item) =>
            setPayload({ ...payload, meal_category: item.value })
          }
          style={Styles.generalInput}
          containerStyle={styles.dropdownContainer}
        />
      </View>
      <View>
        <Text style={Styles.generalInputLabel}>Employee Names</Text>
        <TextInput
          style={Styles.generalInput}
          placeholder="Enter employee names"
          onChangeText={(text) =>
            setPayload({ ...payload, employee_names: text })
          }
        />
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  formContainer: {
    gap: 12,
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
