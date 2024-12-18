import { Image, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";

export default function AuthScreen() {
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
        <Text style={styles.title}>PAI Capture Expense</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <View style={styles.loginButton}>
          <Text style={styles.buttonText}>Login</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 138,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    marginTop: 16,
    color: '#000',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loginButton: {
    backgroundColor: '#1E3A8A', // Dark blue color
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
