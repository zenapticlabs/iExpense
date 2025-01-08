import { useState } from "react";
import { Image, StyleSheet, Pressable, TextInput } from "react-native";
import { Text, View } from "@/components/Themed";

export default function VerifyScreen() {
  const [code, setCode] = useState(["", "", "", "", ""]);

  const images = {
    brand: require("@/assets/images/brand.png"),
  };

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 5) {
      const nextInput = document.querySelector(
        `#code-${index + 1}`
      ) as HTMLElement;
      nextInput?.focus();
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
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 32,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 24,
  },
  codeInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    backgroundColor: "#F5F5F5",
  },
  resendText: {
    fontSize: 14,
    color: "#64748B",
  },
  resendLink: {
    color: "#1E3A8A",
    textDecorationLine: "underline",
  },
  titleContainer: {
    width: "100%",
  },
});
