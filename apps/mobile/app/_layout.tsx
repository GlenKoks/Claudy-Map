import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthStore } from "../src/stores/auth";
import { isPrivacyCurrent, useOnboardingStore } from "../src/stores/onboarding";
import { colors } from "../src/theme";

export const unstable_settings = {
  anchor: "(onboarding)",
};

function useAuthGuard() {
  const router = useRouter();
  const segments = useSegments();

  const authStatus = useAuthStore((s) => s.status);
  const onboardingHydrated = useOnboardingStore((s) => s.hasHydrated);
  const privacyOk = useOnboardingStore(isPrivacyCurrent);

  const ready = authStatus !== "loading" && onboardingHydrated;

  useEffect(() => {
    if (!ready) return;

    const signedIn = authStatus === "signedIn";
    const onboardingComplete = signedIn && privacyOk;
    const inOnboarding = segments[0] === "(onboarding)";

    if (!onboardingComplete && !inOnboarding) {
      router.replace("/(onboarding)");
    } else if (onboardingComplete && inOnboarding) {
      router.replace("/(main)");
    }
  }, [ready, authStatus, privacyOk, segments, router]);

  return ready;
}

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const ready = useAuthGuard();

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {ready ? (
        <Stack screenOptions={{ headerShown: false }} />
      ) : (
        <View style={styles.splash}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
