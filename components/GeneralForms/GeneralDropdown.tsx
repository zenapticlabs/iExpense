import { authService } from "@/services/authService";
import { commonService } from "@/services/commonService";
import { Styles } from "@/Styles";
import { BASE_URL } from "@/utils/UtilData";
import axios from "axios";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface GeneralDropdownProps {
  resource: string;
  value: string;
  onChange: (value: string) => void;
  defaultOptions?: any[];
  disabled?: boolean;
}

export default function GeneralDropdown({
  resource,
  value,
  onChange,
  defaultOptions,
  disabled,
}: GeneralDropdownProps) {
  const [options, setOptions] = useState<any[]>([]);
  useEffect(() => {
    if (defaultOptions) {
      setOptions(defaultOptions);
    } else {
      const fetchData = async () => {
        try {
          const accessToken = await authService.getAccessToken();

          const response = await axios.get(`${BASE_URL}/common/${resource}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setOptions(
            response.data.map((item: any) => ({
              label: item.value,
              value: item.value,
            }))
          );
        } catch (error) {
          console.error("Failed to fetch airlines:", error);
        }
      };
      fetchData();
    }
  }, []);

  return (
    <Dropdown
      data={options}
      disable={disabled}
      labelField="label"
      valueField="value"
      onChange={(item) => onChange(item.value)}
      value={value}
      style={styles.dropdown}
      containerStyle={styles.dropdownContainer}
      selectedTextStyle={styles.selectedTextStyle}
      itemTextStyle={styles.itemTextStyle}
    />
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
    paddingHorizontal: 16,
    paddingVertical: 13,
    width: "100%",
    color: "#1E1E1E",
    fontSize: 14,
  },
  dropdownContainer: {
    width: "100%",
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: "SFProDisplay",
  },
  itemTextStyle: {
    fontSize: 16,
    fontFamily: "SFProDisplay",
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
