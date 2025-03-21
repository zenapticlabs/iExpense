import  commonService  from "@/services/commonService";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

interface GeneralDropdownProps {
  resource?: string;
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
    } else if (resource) {
      const fetchData = async () => {
        try {
          const response = await commonService.fetchResource(resource);
          setOptions(
            response.map((item: any) => ({
              label: item.value || item.rate,
              value: item.value || item.rate,
            }))
          );
        } catch (error) {
          console.error(`Failed to fetch resource ${resource}:`, error);
        }
      };
      fetchData();
    }
  }, []);

  return (
    <Dropdown
      data={[...options]?.sort((a, b) => a?.label?.localeCompare(b?.label))}
      disable={disabled}
      labelField="label"
      valueField="value"
      onChange={(item) => onChange(item.value)}
      value={value}
      style={styles.dropdown}
      containerStyle={styles.dropdownContainer}
      selectedTextStyle={styles.selectedTextStyle}
      itemTextStyle={styles.itemTextStyle}
      flatListProps={{ keyboardShouldPersistTaps: "handled" }}
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
