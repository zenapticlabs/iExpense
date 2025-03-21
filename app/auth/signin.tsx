import {
  Image,
  StyleSheet,
  TextInput,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, View } from "@/components/Themed";
import { useAuth } from "@/context/AuthContext";

export default function AuthScreen() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>();

  const images = {
    brand: require("@/assets/images/brand.png"),
  };

  const handleSignIn = async () => {
    let isValidate = true;
    const newErrors: any = {};
    if (email === "") {
      newErrors.email = "Email is required";
      isValidate = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address";
        isValidate = false;
      }
    }
    if (password === "") {
      newErrors.password = "Password is required";
      isValidate = false;
    }
    setErrors(newErrors);
    if (!isValidate) return;

    try {
      setIsLoading(true);
      await signIn(email, password);
    } catch (error) {
      setErrors({
        password: "Invalid email or password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Image
            source={images.brand}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Sign In</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors?.email && (
              <Text className="!text-red-500 mt-1 mb-2">{errors?.email}</Text>
            )}
            <Text style={styles.label} className="mt-4">
              Password
            </Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {errors?.password && (
              <Text className="!text-red-500 mt-1 mb-2">
                {errors?.password}
              </Text>
            )}
            <Link href="/auth/reset" style={styles.forgotPassword}>
              Forgot password?
            </Link>
          </View>
          <View style={styles.bottomContainer}>
            <Pressable
              style={[
                styles.loginButton,
                { backgroundColor: isLoading ? "#8792B3" : "#17317F" },
              ]}
              onPress={handleSignIn}
              className="flex-row gap-4 justify-center"
            >
              <Text style={styles.buttonText}>Login</Text>
              {isLoading && <ActivityIndicator color={"white"} />}
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
  },
  image: {
    width: 160,
    height: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 30,
    color: "#1E1E1E",
    fontFamily: "SFProDisplay",
  },
  inputContainer: {
    width: "100%",
  },
  titleContainer: {
    width: "100%",
    marginTop: 4,
  },
  label: {
    fontSize: 15,
    color: "#000",
    marginBottom: 4,
    fontFamily: "SFProDisplay",
  },
  input: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "white",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#5B5B5B",
    fontSize: 15,
    marginTop: 4,
    marginBottom: 4,
    textDecorationLine: "underline",
    fontFamily: "SFProDisplay",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  toggleLabel: {
    marginLeft: 8,
    fontSize: 15,
    color: "#5B5B5B",
    fontFamily: "SFProDisplay",
  },
  bottomContainer: {
    paddingBottom: 40,
    width: "100%",
  },
  loginButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
    marginTop: 8,
    height: 56,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "SFProDisplay",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: "#5B5B5B",
    fontSize: 15,
    fontFamily: "SFProDisplay",
  },
  signupLink: {
    color: "#17317F",
    fontSize: 14,
    fontWeight: 600,
    textDecorationLine: "underline",
    fontFamily: "SFProDisplay",
  },
});
