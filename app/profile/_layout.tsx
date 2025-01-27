// app/_layout.tsx
import { useAuth } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const { checkToken } = useAuth();
  useEffect(() => {
    checkToken();
  }, []);
  return (
    <Stack>
      {/* Your routes will be rendered here */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* Add other screens as needed */}
    </Stack>
  );
}
