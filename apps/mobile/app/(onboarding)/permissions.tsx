import { useState } from "react";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/Button";
import { useOnboardingStore } from "../../src/stores/onboarding";
import { colors, spacing } from "../../src/theme";

type Status = "idle" | "requesting" | "granted" | "partial" | "denied";

export default function PermissionsScreen() {
  const router = useRouter();
  const setLocation = useOnboardingStore((s) => s.setLocation);
  const [status, setStatus] = useState<Status>("idle");

  const requestPermissions = async () => {
    setStatus("requesting");
    const foreground = await Location.requestForegroundPermissionsAsync();
    if (!foreground.granted) {
      setStatus("denied");
      setLocation("denied");
      return;
    }
    // Consent to background location was captured on the previous screen.
    const background = await Location.requestBackgroundPermissionsAsync();
    const result = background.granted ? "granted" : "partial";
    setStatus(result);
    setLocation(result);
  };

  const goNext = () => router.push("/login");

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <Text style={styles.emoji}>📍</Text>
        <Text style={styles.title}>Доступ к геолокации</Text>
        <Text style={styles.body}>
          Чтобы открывать карту по мере прогулок, приложению нужен доступ к
          геолокации — в том числе <Text style={styles.bold}>в фоне</Text>, пока
          экран заблокирован.
        </Text>

        {status === "granted" ? (
          <Text style={styles.ok}>✓ Доступ «Всегда» предоставлен.</Text>
        ) : null}
        {status === "partial" ? (
          <Text style={styles.warn}>
            Доступ дан только при использовании. Для фонового трекинга включи
            «Всегда» в настройках позже.
          </Text>
        ) : null}
        {status === "denied" ? (
          <Text style={styles.warn}>
            Доступ отклонён. Приложение будет ограничено — включить можно в
            настройках устройства.
          </Text>
        ) : null}
      </View>

      <View style={styles.footer}>
        {status === "idle" || status === "requesting" ? (
          <Button
            label="Разрешить доступ"
            loading={status === "requesting"}
            onPress={requestPermissions}
          />
        ) : (
          <Button label="Продолжить" onPress={goNext} />
        )}
        {status !== "idle" && status !== "requesting" ? (
          <Button
            label="Запросить ещё раз"
            variant="secondary"
            onPress={requestPermissions}
            style={styles.secondaryBtn}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.md,
  },
  emoji: {
    fontSize: 56,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "700",
  },
  body: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 23,
  },
  bold: {
    color: colors.text,
    fontWeight: "600",
  },
  ok: {
    color: "#5BD98A",
    fontSize: 15,
  },
  warn: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  secondaryBtn: {
    marginTop: spacing.sm,
  },
});
