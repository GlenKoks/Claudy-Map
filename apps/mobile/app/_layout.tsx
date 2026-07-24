import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Both (onboarding) and (main) expose an index screen. The anchor makes
// onboarding the default entry point; later stages will add real logic to
// switch between onboarding and the main app.
export const unstable_settings = {
  anchor: "(onboarding)",
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
