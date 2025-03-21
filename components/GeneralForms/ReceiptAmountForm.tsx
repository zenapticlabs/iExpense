import { Styles } from "@/Styles";
import { useEffect, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { Text, View, TextInput } from "react-native";
import CurrencyDropdown from "@/components/CurrencyDropdown";
import commonService, { HotelDailyBaseRate } from "@/services/commonService";

interface ReceiptAmountFormProps {
  control: any;
  errors: any;
  exchangeRates: any;
  defaultCurrency: string;
  disabled?: boolean;
  expenseType?: any;
  orgId?: number;
  trigger?: any;
}

export const getMaxHotelRate = (
  selectedCity: string,
  hotelRates: HotelDailyBaseRate[],
  receiptCurrency: string
): HotelDailyBaseRate | null => {
  const normalizedCity = selectedCity.toLowerCase().trim();

  const countryMatch = selectedCity.match(/^(usa|can|canada|japan)/i);
  const selectedCountry = countryMatch ? countryMatch[0].toLowerCase() : null;

  let matchedRate = hotelRates.find(rate => rate.city.toLowerCase().trim() === normalizedCity);
  if (matchedRate) {
    return matchedRate;
  }

  if (normalizedCity.includes("other") && selectedCountry) {
    matchedRate = hotelRates.find(rate =>
      rate.city.toLowerCase().includes("other cities") &&
      rate.country.toLowerCase() === selectedCountry
    );

    if (matchedRate) {
      return matchedRate;
    }
  }

  matchedRate = hotelRates.find(rate =>
    rate.city.toLowerCase().includes(normalizedCity)
  );
  if (matchedRate) {
    return matchedRate;
  }

  matchedRate = hotelRates.find(rate => {
    const strippedSelectedCity = normalizedCity.replace(/^(usa-|can-|canada-|japan-)/, "").trim();
    return rate.city.toLowerCase().includes(strippedSelectedCity);
  });
  if (matchedRate) {
    return matchedRate;
  }

  const fallbackRate = hotelRates.find(
    rate =>
      rate.city.toLowerCase().includes("other cities") &&
      rate.currency.toLowerCase() === receiptCurrency.toLowerCase()
  );
  return fallbackRate || null;
};

export default function ReceiptAmountForm({
  control,
  trigger,
  errors,
  expenseType,
  exchangeRates,
  defaultCurrency,
  orgId,
  disabled,
}: ReceiptAmountFormProps) {
  const [receiptCurrency, setReceiptCurrency] = useState(defaultCurrency);
  const [receiptAmount, setReceiptAmount] = useState(0);
  const [convertedCurrency, setConvertedCurrency] = useState(defaultCurrency);
  const [convertedAmount, setConvertedAmount] = useState(0);

  useEffect(() => {
    setConvertedCurrency(defaultCurrency);
    setReceiptCurrency(defaultCurrency);
  }, [defaultCurrency]);

  const mealCategory = useWatch({ control, name: "meal_category" });
  const totalEmployees = useWatch({ control, name: "total_employees" })
  const hotelCity = useWatch({ control, name: "city" });
  useEffect(() => {
    if (trigger && (mealCategory || hotelCity || receiptCurrency || totalEmployees)) {
      trigger("receipt_amount");
    }
  }, [mealCategory, trigger, hotelCity, receiptCurrency, totalEmployees]);

  const convertAmount = (amount: number, sourceCurrency: string, targetCurrency: string) => {
    return (exchangeRates[targetCurrency] / exchangeRates[sourceCurrency]) *
      amount;
  }

  useEffect(() => {
    if (receiptCurrency || receiptAmount) {
      const convertedAmount = convertAmount(receiptAmount, receiptCurrency, convertedCurrency);
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
          defaultValue={defaultCurrency}
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
              mealLimit: (value) => {
                if (orgId !== 141 && orgId !== 101) return true;
                const maxAmountOrg = orgId === 141 ? 100 : 75;
                const maxAmount = maxAmountOrg * (totalEmployees || 1)
                console.log(maxAmount, Number(convertedAmount))
                if ((expenseType === "Business Meals" && mealCategory) && Number(convertedAmount) > maxAmount) {
                  return `Amount cannot exceed $${maxAmountOrg} per employee`;
                }
                return true;
              },
              hotelLimit: async (value) => {
                return true;
              }
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
                onChangeText={(text) => {
                  let cleanedText = text.replace(/[^0-9.]/g, "");
                  const parts = cleanedText.split(".");
                  if (parts.length > 2) {
                    cleanedText = parts[0] + "." + parts.slice(1).join("");
                  }
                  onChange(cleanedText);
                }}
                onBlur={() => {
                  let formattedValue = parseFloat(value || "0").toFixed(2);
                  onChange(formattedValue);
                }}
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
          disabled={true}
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
