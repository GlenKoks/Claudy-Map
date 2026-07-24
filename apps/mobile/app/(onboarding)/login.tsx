import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/Button";
import { useAuthStore } from "../../src/stores/auth";
import { colors, spacing } from "../../src/theme";

export default function LoginScreen() {
  const signIn = useAuthStore((s) => s.signIn);
  const [busy, setBusy] = useState(false);

  const onContinue = async () => {
    setBusy(true);
    try {
      await signIn();
      // Root guard redirects to (main) once signed in.
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <Text style={styles.emoji}>👋</Text>
        <Text style={styles.title}>Почти готово</Text>
        <Text style={styles.body}>
          Вход пока в режиме заглушки — авторизация через Telegram появится
          позже. Нажми «Продолжить», чтобы войти как гость.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button label="Продолжить" loading={busy} onPress={onContinue} />
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
  footer: {
    paddingBottom: spacing.md,
  },
});
