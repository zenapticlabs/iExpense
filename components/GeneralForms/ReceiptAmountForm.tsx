import { commonService } from "@/services/commonService";
import { Styles } from "@/Styles";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, View, TextInput } from "react-native";
import CurrencyDropdown from "@/components/CurrencyDropdown";

interface ReceiptAmountFormProps {
  control: any;
  errors: any;
  exchangeRates: any;
  defaultCurrency: string;
  disabled?: boolean;
}

export default function ReceiptAmountForm({
  control,
  errors,
  exchangeRates,
  defaultCurrency,
  disabled,
}: ReceiptAmountFormProps) {
  const [receiptCurrency, setReceiptCurrency] = useState("USD");
  const [receiptAmount, setReceiptAmount] = useState(0);
  const [convertedCurrency, setConvertedCurrency] = useState("USD");
  const [convertedAmount, setConvertedAmount] = useState(0);

  useEffect(() => {
    setConvertedCurrency(defaultCurrency);
  }, [defaultCurrency]);

  useEffect(() => {
    console.log(receiptCurrency, receiptAmount, convertedCurrency);
    if (receiptCurrency && receiptAmount) {
      const convertedAmount =
        (exchangeRates[convertedCurrency] / exchangeRates[receiptCurrency]) *
        receiptAmount;
      setConvertedAmount(convertedAmount);
    }
  }, [receiptCurrency, receiptAmount, convertedCurrency]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <View className="mb-4 border border-gray-300 rounded-lg p-4">
      <Text className="font-sfpro text-base font-medium text-[#1E1E1E] mb-1">
        Receipt currency
        <Text className="text-red-500">*</Text>
      </Text>
      <View className="flex-row items-center mb-4">
        <Controller
          control={control}
          name="receipt_currency"
          defaultValue="USD"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => {
            useEffect(() => {
              setReceiptCurrency(value);
            }, [value]);
            const handleCurrencyChange = (value: string) => {
              // setReceiptCurrency(value);
              onChange(value);
            };
            return (
              <CurrencyDropdown
                value={value}
                onChange={handleCurrencyChange}
                disabled={disabled}
              />
            );
          }}
        />
        <Controller
          control={control}
          name="receipt_amount"
          rules={{
            required: "Amount is required",
            validate: {
              isNumber: (value) =>
                !isNaN(Number(value)) || "Amount must be a number",
              isPositive: (value) =>
                Number(value) > 0 || "Amount must be greater than 0",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => {
            useEffect(() => {
              setReceiptAmount(parseFloat(value));
            }, [value]);
            return (
              <TextInput
                style={[Styles.generalInput, { flex: 1, marginLeft: 16 }]}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={value}
                editable={!disabled}
                onChangeText={onChange}
              />
            );
          }}
        />
      </View>
      {errors.receipt_amount && (
        <Text className="text-red-500">{errors.receipt_amount.message}</Text>
      )}
      <Text className="font-sfpro text-base font-medium text-[#1E1E1E] mb-1">
        Converted amount
      </Text>
      <View className="flex-row items-center">
        <CurrencyDropdown
          value={convertedCurrency}
          onChange={(value) => setConvertedCurrency(value)}
        />
        <TextInput
          style={[Styles.generalInput, { flex: 1, marginLeft: 16 }]}
          placeholder="0.00"
          keyboardType="decimal-pad"
          defaultValue="0"
          editable={false}
          value={convertedAmount.toString()}
        />
      </View>
    </View>
  );
}
