import { createContext, useContext, useState, useEffect } from "react";
import { router, useSegments, useRootNavigationState } from "expo-router";
import { storage } from "@/utils/storage";
import LoadingScreen from "@/components/LoadingScreen";
import { authService } from "@/services/authService";

interface User {
  email: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  verifyCode: (email: string, code: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function useProtectedRoute(user: User | null) {
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === "auth";
 
    if (!user && !inAuthGroup) {
      router.replace("/auth");
    } else if (user && inAuthGroup) {
      router.replace("/reports");
    }
  }, [user, segments, navigationState?.key]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useProtectedRoute(user);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const { access, refresh } = await storage.getAuthData();
      if (access && refresh) {
        setUser({
          email: "test",
          token: access,
        });
      }
    } catch (error) {
      console.error("Error loading auth data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (email: string, code: string) => {
    try {
      const { access, refresh } = await authService.verify(email, code);
      await storage.setAuthData(access, refresh);
      setUser({
        email: email,
        token: access,
      });
    } catch (error) {
      console.error("Verification error:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // const { token, user: userData } = await authService.login(email, password);
      const { access, refresh } = await authService.login(email, password);
      await storage.setAuthData(access, refresh);
      // setUser({ ...userData, token });
      setUser({
        email: email,
        token: access,
      });
    } catch (error) {
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
      if (error === "second_factor_required") {
        router.replace("/auth/verify");
      } else {
        console.log(error);
      }
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
    <AuthContext.Provider
      value={{ user, signIn, signOut, isLoading, verifyCode }}
    >
      {children}
    </AuthContext.Provider>
  );
}
