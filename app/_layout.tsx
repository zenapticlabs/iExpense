import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import * as Linking from "expo-linking";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import { AuthProvider } from "@/context/AuthContext";

import "../global.css";
import { Platform } from "react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  let [fontsLoaded] = useFonts({
    "SFProDisplay": require("../assets/fonts/sfprodisplay-regular.otf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true); // ✅ Ensure `isReady` is set before running anything

    // Handle initial deep link on app open
    const handleInitialURL = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        handleDeepLink(url);
      } else {
        router.replace("/auth"); // ✅ Default to /auth on first load
      }
    };

    handleInitialURL();

    // Listen for deep link changes
    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDeepLink = (url: string | null) => {
    if (!url) {
      console.warn("Invalid deep link URL");
      router.replace("/auth");
      return;
    }

    try {
      const parsed = Linking.parse(url);
      console.log("Deep link received:", parsed);

      if (parsed.queryParams?.token) {
        router.replace({
          pathname: "/auth/reset-password",
          params: { token: parsed.queryParams.token },
        });
      } else if (parsed.path) {
        router.replace({
          pathname: `/${parsed.path}` as any,
          params: parsed.queryParams as any,
        });
      } else {
        router.replace("/auth");
      }
    } catch (error) {
      console.error("Failed to parse deep link:", error);
      router.replace("/auth");
    }
  };

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="reports" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
