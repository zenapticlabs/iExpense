import { useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    TextInput,
    Pressable,
    ActivityIndicator,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import { authService } from "@/services/authService";

export default function ResetPasswordScreen() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleReset = async () => {
        setMessage("");
        setError("");

        if (!email) {
            setError("Email is required");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);
        try {
            await authService.forgotPassword(email);
            setMessage("A password reset link has been sent to your email.");
        } catch (err) {
            setError("Failed to send reset link. Please try again after checking your email record in our system");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View style={styles.container}>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>
                    Enter your email address and we will send you a link to reset your password.
                </Text>

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {error ? <Text className="!text-red-500 mt-2">{error}</Text> : null}
                {message ? <Text className="!text-green-500 mt-2">{message}</Text> : null}

                <Pressable
                    style={[styles.resetButton, { backgroundColor: isLoading ? "#8792B3" : "#17317F" }]}
                    onPress={handleReset}
                    disabled={isLoading}
                    className="flex-row gap-4 justify-center"
                >
                    <Text style={styles.buttonText}>Send Reset Link</Text>
                    {isLoading && <ActivityIndicator color="white" />}
                </Pressable>

                <Link href="/auth" style={styles.backLink}>
                    Back to Login
                </Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        backgroundColor: "white",
    },
    title: {
        fontSize: 28,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 10,
        color: "#1E1E1E",
        fontFamily: "SFProDisplay",
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        color: "#5B5B5B",
        marginBottom: 20,
        fontFamily: "SFProDisplay",
    },
    label: {
        fontSize: 15,
        color: "#000",
        marginBottom: 8,
        fontFamily: "SFProDisplay",
    },
    input: {
        width: "100%",
        height: 48,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 8,
        padding: 16,
        backgroundColor: "white",
    },
    resetButton: {
        marginTop: 20,
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        height: 56,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        fontFamily: "SFProDisplay",
    },
    backLink: {
        marginTop: 20,
        textAlign: "center",
        color: "#17317F",
        fontSize: 15,
        textDecorationLine: "underline",
        fontFamily: "SFProDisplay",
    },
});
