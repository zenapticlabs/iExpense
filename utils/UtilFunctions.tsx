import { options } from "@/components/CurrencyDropdown";
import dayjs from "dayjs";

export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "N/A";

  return dayjs(dateString).format("DD-MMM-YYYY");
};

export const formatAmount = (currency?: string, string_amount?: string): string => {
  const currencySymbol = getCurrencySymbol(currency);
  const amount = parseFloat(string_amount || "0")?.toFixed(2)
  const currencyValue = getCurrencyValue(currency);
  return `${currencySymbol} ${amount} ${currencyValue}`;
}

export const getCurrencySymbol = (currency?: string): string => {
  const currencySymbol = options.find((option) => currency === option.value)
  return currencySymbol?.symbol || "";
}

export const getCurrencyValue = (currency?: string): string => {
  const currencySymbol = options.find((option) => currency === option.value)
  return currencySymbol?.value || "";
}