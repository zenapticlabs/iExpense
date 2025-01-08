// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Your routes will be rendered here */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      {/* Add other screens as needed */}
    </Stack>
  );
}