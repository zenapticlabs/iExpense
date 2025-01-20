import { useState } from "react";
import { Image, StyleSheet, Pressable, TextInput, Alert } from "react-native";
import { Text, View } from "@/components/Themed";
import { useAuth } from "@/context/AuthContext";

export default function VerifyScreen() {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const { verifyCode } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const images = {
    brand: require("@/assets/images/brand.png"),
  };

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 4) {
      const nextInput = document.querySelector(
        `#code-${index + 1}`
      ) as HTMLElement;
      nextInput?.focus();
    }
    if (text && index === 4) {
      const fullCode = newCode.join("");
      const email = localStorage.getItem("email") as string;
      if (fullCode.length === 5) {
        verifyCode(email, fullCode);
      }
    }
  };

  const handleResend = () => {
    // Implement resend logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Image
            source={images.brand}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>Enter code</Text>
          <Text style={styles.subtitle}>
            We've sent an SMS with an activation code to the registered phone
            number.
          </Text>
        </View>
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              id={`code-${index}`}
              style={styles.codeInput}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <Pressable onPress={handleResend}>
          <Text style={styles.resendText}>
            Didn't receive the code?{" "}
            <Text style={styles.resendLink}>Resend</Text>
          </Text>
        </Pressable>
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
    alignItems: "center",
    paddingTop: 60,
  },
  image: {
    width: 84,
    height: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginTop: 64,
    marginBottom: 8,
    color: "#1E1E1E",
    fontFamily: "SFProDisplay"
  },
  subtitle: {
    fontSize: 15,
    color: "#1E1E1E",
    marginBottom: 20,
    marginTop: 10,
    fontFamily: "SFProDisplay"
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 24,
    gap: 5,
  },
  codeInput: {
    maxWidth: 63,
    height: 80,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    backgroundColor: "#F5F5F5",
  },
  resendText: {
    fontSize: 15,
    color: "#1E1E1E",
    fontFamily: "SFProDisplay"
  },
  resendLink: {
    fontSize: 15,
    color: "#17317F",
    textDecorationLine: "underline",
    fontFamily: "SFProDisplay"
  },
  titleContainer: {
    width: "100%",
  },
});
