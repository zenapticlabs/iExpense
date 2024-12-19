// app/_layout.tsx
import { View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function RootLayout() {
  return (
    <Stack>
      {/* Your routes will be rendered here */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="details"
        options={{
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShadowVisible: false,
        }}
      />
      {/* Add other screens as needed */}
    </Stack>
  );
}
// In your styles:
const styles = StyleSheet.create({
  headerRight: {
    flexDirection: "row",
    gap: 15,
    marginRight: 8,
  },
  // ... other styles
});
