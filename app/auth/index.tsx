import { Image, StyleSheet, ImageBackground, SafeAreaView } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";

export default function AuthScreen() {
  const images = {
    brand: require("@/assets/images/brand.png"),
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <ImageBackground
        source={require("../../assets/images/Pattern.png")}
        style={styles.background}
      >
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <Image
              source={images.brand}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.title} className="font-sfpro">
              PAI Capture Expense
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Link href="/auth/signin" style={styles.loginButton}>
              <Text style={styles.buttonText}>Login</Text>
            </Link>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
    width: "100%",
  },
  background: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  image: {
    width: 138,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    marginTop: 16,
    color: "#000",
    fontFamily: "SFProDisplay",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: "transparent",
  },
  loginButton: {
    backgroundColor: "#17317F", // Dark blue color
    padding: 16,
    borderRadius: 8,
    textAlign: "center",
    alignItems: "center",
    height: 56,
    fontFamily: "SFProDisplay",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
  },
});
