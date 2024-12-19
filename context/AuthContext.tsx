import { createContext, useContext, useState, useEffect } from "react";
import { router, useSegments, useRootNavigationState } from "expo-router";
import { storage } from "@/utils/storage";
import LoadingScreen from "@/components/LoadingScreen";

type User = {
  id: string;
  email: string;
  name: string;
  token?: string;
} | null;

type AuthContextType = {
  user: User;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function useProtectedRoute(user: User) {
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup) {
      router.replace("/auth");
    } else if (user && inAuthGroup) {
      router.replace("/expense");
    }
  }, [user, segments, navigationState?.key]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useProtectedRoute(user);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    try {
      const { token, userData } = await storage.getAuthData();

      if (token && userData) {
        // Optional: Validate token with your backend here
        setUser({ ...userData, token });
      }
    } catch (error) {
      console.error("Error loading auth data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Replace with your actual API call
      // const response = await fetch("BASEURL/login", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ email, password }),
      // });

      // if (!response.ok) {
      //   throw new Error("Authentication failed");
      // }

      // const { token, user: userData } = await response.json();

      const token = "1234567890";
      const userData = {
        id: "1",
        email: email,
        name: "Test User",
      };
      // Store auth data
      await storage.setAuthData(token, userData);

      // Update state
      setUser({ ...userData, token });
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await storage.clearAuthData();
      setUser(null);
      router.replace("/auth");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
