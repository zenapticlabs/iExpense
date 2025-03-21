import React, { useState } from "react";
import { View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import CountryFlag from "react-native-country-flag";
import { Ionicons } from "@expo/vector-icons";

// Define the type for each dropdown item
interface Option {
  label: string;
  value: string;
  countryCode: string;
  symbol: string;
}

export const options: Option[] = [
  {
    label: "USD $",
    value: "USD",
    countryCode: "US",
    symbol: "$"
  },
  {
    label: "CAD $",
    value: "CAD",
    countryCode: "CA",
    symbol: "$"
  },
  {
    label: "JPY ¥",
    value: "JPY",
    countryCode: "JP",
    symbol: "¥"
  },
];

const CurrencyDropdown = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) => {
  return (
    <View style={{ flex: 1, width: "100%" }}>
      <Dropdown
        data={options}
        labelField="label"
        valueField="value"
        disable={disabled}
        value={value}
        onChange={(item: Option) => {
          onChange(item.value);
        }}
        placeholder="Select currency"
        // containerStyle={{ width: '100%' }}
        style={{
          borderColor: "#ccc",
          backgroundColor: "white",
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 14,
          width: "100%",
        }}
        selectedTextStyle={{ fontFamily: "SFProDisplay", fontSize: 15 }}
        renderLeftIcon={() => {
          const selectedItem = options.find((item) => item.value === value);
          return selectedItem ? (
            <Text style={{ marginRight: 10, fontSize: 15 }}>
              <CountryFlag isoCode={selectedItem.countryCode} size={16} />
            </Text>
          ) : null;
        }}
        renderRightIcon={() => (disabled ? null : <Ionicons name="chevron-down" size={16} color="gray" />)}
        renderItem={(item: Option) => (
          <View
            style={{ padding: 10, flexDirection: "row", alignItems: "center" }}
          >
            <Text style={{ marginRight: 10 }}>
              <CountryFlag isoCode={item.countryCode} size={16} />
            </Text>
            <Text style={{ fontFamily: "SFProDisplay", fontSize: 16 }}>
              {item.label}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default CurrencyDropdown;
