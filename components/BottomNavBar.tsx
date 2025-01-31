import { View, Text } from "@/components/Themed";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";

interface BottomNavBarProps {
  onNewReport?: () => void;
  page: "reports" | "profile";
}

export default function BottomNavBar({ onNewReport, page }: BottomNavBarProps) {
  return (
    <View className="flex-row justify-around items-center border-t border-[#E2E8F0] pt-3 pb-6 bg-white">
      <Link href="/reports" asChild>
        <View className="items-center">
          <Ionicons
            name="document-text-outline"
            size={24}
            color={page === "reports" ? "#1e1e1e" : "#888888"}
          />
          <Text
            className={`text-xs mt-1 font-['SFProDisplay'] ${
              page === "reports" ? "!text-[#1E1E1E]" : "!text-[#888888]"
            }`}
          >
            Reports
          </Text>
        </View>
      </Link>
      <View className="items-center">
        <Pressable
          className="bg-[#1e1e1e] w-[42px] h-[42px] rounded-full items-center justify-center mb-2"
          onPress={onNewReport}
        >
          <Ionicons name="add" size={24} color="white" />
        </Pressable>
      </View>
      <Link href="/profile" asChild>
        <View className="items-center">
          <Ionicons
            name="person-outline"
            size={24}
            color={page === "profile" ? "#1e1e1e" : "#888888"}
          />
          <Text
            className={`text-xs mt-1 font-['SFProDisplay'] ${
              page === "profile" ? "!text-[#1E1E1E]" : "!text-[#888888]"
            }`}
          >
            My Profile
          </Text>
        </View>
      </Link>
    </View>
  );
}
