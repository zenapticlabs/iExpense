import { View, Text } from "@/components/Themed";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface BottomNavBarProps {
  onNewReport?: () => void;
  page: "reports" | "profile";
  hideButton?: boolean
}

export default function BottomNavBar({ onNewReport, page, hideButton }: BottomNavBarProps) {
  const router = useRouter();

  return (
    <View className="flex-row justify-around items-center border-t border-[#E2E8F0] pt-3 pb-6 bg-white">
      <Pressable onPress={() => router.push("/reports")}>
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
      </Pressable>
      <View className="items-center">
        <Pressable
          className="bg-[#1e1e1e] w-[42px] h-[42px] rounded-full items-center justify-center mb-2"
          style={{opacity: hideButton ? 0 : 100}}
          onPress={onNewReport}
        >
          <Ionicons name="add" size={24} color="white" />
        </Pressable>
      </View>
      <Pressable onPress={() => router.push("/profile")}>
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
      </Pressable>
    </View>
  );
}
