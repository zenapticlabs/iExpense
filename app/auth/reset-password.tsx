import { useState, useEffect } from "react";
import {
    SafeAreaView,
    StyleSheet,
    TextInput,
    Pressable,
    ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Text, View } from "@/components/Themed";
import { authService } from "@/services/authService";


export default function ResetPasswordScreen() {
    const router = useRouter();
    const { token } = useLocalSearchParams();
    const resetToken = (typeof token === "string" ? token : "") as string;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            setError("Invalid reset link. Please request a new one.");
        }
    }, [token]);

    const validatePassword = (password: string) => {
        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        if (/^\d+$/.test(password)) {
            return "Password cannot be entirely numeric.";
        }
        if (password.toLowerCase() === "password" || password.toLowerCase() === "12345678") {
            return "This password is too common.";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }
        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter.";
        }
        if (!/\d/.test(password)) {
            return "Password must contain at least one number.";
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            return "Password must contain at least one special character (e.g., @, #, $, etc.).";
        }
        return null; // No errors
    };

    const handleResetPassword = async () => {
        setMessage("");
        setError("");

        if (!password || !confirmPassword) {
            setError("Both fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        setIsLoading(true);
        try {
            await authService.resetPassword(resetToken, password);
            setMessage("Password successfully reset! Redirecting to login...");
            router.replace("/auth");
        } catch (err) {
            setError("Failed to reset password. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View style={styles.container}>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>
                    Enter your new password below.
                </Text>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />
                {error ? <Text className="!text-red-500 mt-2 flex justify-center">{error}</Text> : null}
                {message ? <Text className="!text-green-500 mt-2 flex justify-center">{message}</Text> : null}

                <Pressable
                    style={[styles.resetButton, { backgroundColor: isLoading ? "#8792B3" : "#17317F" }]}
                    onPress={handleResetPassword}
                    disabled={isLoading}
                    className="flex-row gap-4 justify-center"
                >
                    <Text style={styles.buttonText}>Reset Password</Text>
                    {isLoading && <ActivityIndicator color="white" />}
                </Pressable>

                <Pressable onPress={() => router.replace("/auth/signin")}>
                    <Text style={styles.backLink}>Back to Login</Text>
                </Pressable>
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
        paddingVertical: 4,
        paddingHorizontal: 16,
        backgroundColor: "white",
        marginBottom: 8,
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
