import { Image, StyleSheet, TextInput, Switch, Pressable } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, View } from "@/components/Themed";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [biometricLogin, setBiometricLogin] = useState(false);

  const images = {
    brand: require("@/assets/images/brand.png"),
  };

  return (
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

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Link href="/auth" style={styles.forgotPassword}>
            Forgot password?
          </Link>

          <View style={styles.toggleContainer}>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              trackColor={{ false: "#767577", true: "#1E3A8A" }}
            />
            <Text style={styles.toggleLabel}>Remember me</Text>
          </View>

          <View style={styles.toggleContainer}>
            <Switch
              value={biometricLogin}
              onValueChange={setBiometricLogin}
              trackColor={{ false: "#767577", true: "#1E3A8A" }}
            />
            <Text style={styles.toggleLabel}>Enable biometric login</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Pressable style={styles.loginButton}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <Link href="/auth" style={styles.signupLink}>
            Sign up
          </Link>
        </View>
      </View>
    </View>
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
    width: 138,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 30,
    color: "#000",
  },
  inputContainer: {
    width: "100%",
  },
  titleContainer: {
    width: "100%",
  },
  label: {
    fontSize: 15,
    color: "#000",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 44,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: "white",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#1E3A8A",
    fontSize: 14,
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  toggleLabel: {
    marginLeft: 8,
    fontSize: 15,
    color: "#000",
  },
  bottomContainer: {
    paddingBottom: 40,
  },
  loginButton: {
    backgroundColor: "#1E3A8A",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: "#64748B",
    fontSize: 14,
  },
  signupLink: {
    color: "#1E3A8A",
    fontSize: 14,
  },
});
