import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function OnboardingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello Claudy Map</Text>
      <Text style={styles.subtitle}>Onboarding</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
  },
});
