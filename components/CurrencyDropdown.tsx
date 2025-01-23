import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import CountryFlag from "react-native-country-flag";

// Define the type for each dropdown item
interface Option {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const CurrencyDropdown = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {

  // Define the data for dropdown options
  const options: Option[] = [
    { label: 'USD $', value: 'usd', icon: <CountryFlag isoCode="US" size={20} /> },
    { label: 'EUR €', value: 'eur', icon: <CountryFlag isoCode="EU" size={20} /> },
    { label: 'INR ₹', value: 'inr', icon: <CountryFlag isoCode="IN" size={20} /> },
  ];

  return (
    <View style={{ flex: 1, width: '100%' }}>
      <Dropdown
        data={options}
        labelField="label"
        valueField="value"
        value={value}
        onChange={(item: Option) => {
          onChange(item.value);
        }}
        placeholder="Select currency"
        // containerStyle={{ width: '100%' }}
        style={{
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 12,
          width: '100%',
        }}
        renderLeftIcon={() => {
          const selectedItem = options.find(item => item.value === value);
          return selectedItem ? (
            <Text style={{ marginRight: 10 }}>{selectedItem.icon}</Text>
          ) : null;
        }}
        renderItem={(item: Option) => (
          <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ marginRight: 10 }}>{item.icon}</Text>
            <Text>{item.label}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default CurrencyDropdown;
