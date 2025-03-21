import { ExpenseType, getAllowedExpenseTypes } from "@/utils/UtilData";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface RenderStep1Props {
  expenseType: string | null;
  orgId?: number;
  reportType?: string;
  setExpenseType: (value: string | null) => void;
  handleClose: () => void;
  handleNextStep: () => void;
}

export default function RenderStep1({
  expenseType,
  orgId = 101,
  reportType = "Domestic",
  setExpenseType,
  handleClose,
  handleNextStep,
}: RenderStep1Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const allowedExpenseTypes = getAllowedExpenseTypes(orgId, reportType);
  return (
    <View className="flex-1 p-5">
      <Text className="text-2xl font-semibold font-sfpro mb-4">
        Create New Expense
      </Text>
      <Text className="text-xl py-5 font-sfpro">Select expense type</Text>

      <View className="flex-row items-center bg-gray-100 rounded-lg mb-4">
        <Ionicons
          name="search"
          size={20}
          color="#666"
          className="absolute left-3"
        />
        <TextInput
          className="flex-1 text-base py-4 pl-10 font-sfpro"
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView className="flex gap-4 flex-1">
        {allowedExpenseTypes
          .filter((type) =>
            type.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((type) => (
            <TouchableOpacity
              key={type}
              className={`flex-row justify-between mb-2 items-center p-4 rounded-lg border ${
                expenseType === type
                  ? "bg-blue-50 border-blue-900"
                  : "border-gray-200"
              }`}
              onPress={() => setExpenseType(type)}
            >
              <Text className="text-base font-sfpro">{type}</Text>
              {expenseType === type && (
                <Ionicons name="checkmark" size={20} color="#1E3A8A" />
              )}
            </TouchableOpacity>
          ))}
      </ScrollView>

      <View className="flex-row justify-between mt-5">
        <TouchableOpacity
          className="flex-1 mr-2 p-2.5 rounded-lg bg-gray-100"
          onPress={handleClose}
        >
          <Text className="text-gray-600 text-lg text-center font-sfpro font-medium">
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 ml-2 p-2.5 rounded-lg ${
            !expenseType ? "bg-gray-400" : "bg-blue-900"
          }`}
          onPress={() => expenseType && handleNextStep()}
          disabled={!expenseType}
        >
          <Text className="text-white text-lg text-center font-sfpro font-medium">
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
