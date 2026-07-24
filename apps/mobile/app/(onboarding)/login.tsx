import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { TelegramAuthData } from "@claudy-map/shared-types";
import { Button } from "../../src/components/Button";
import { TelegramLoginWebView } from "../../src/components/TelegramLoginWebView";
import { appConfig } from "../../src/lib/config";
import { authenticateWithTelegram } from "../../src/lib/api";
import { useAuthStore } from "../../src/stores/auth";
import { colors, spacing } from "../../src/theme";

export default function LoginScreen() {
  const signInWithTelegram = useAuthStore((s) => s.signInWithTelegram);
  const signInDev = useAuthStore((s) => s.signInDev);

  const [showWebView, setShowWebView] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasBot = Boolean(appConfig.telegramBotUsername);

  const onTelegramAuth = async (payload: TelegramAuthData) => {
    setShowWebView(false);
    setBusy(true);
    setError(null);
    try {
      const res = await authenticateWithTelegram(payload);
      await signInWithTelegram(res);
      // Root guard redirects to (main) once signed in.
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось войти.");
    } finally {
      setBusy(false);
    }
  };

  const onDevLogin = async () => {
    setBusy(true);
    setError(null);
    try {
      await signInDev();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Dev-вход не удался.");
    } finally {
      setBusy(false);
    }
  };

  if (showWebView) {
    return (
      <SafeAreaView style={styles.webviewContainer} edges={["top", "bottom"]}>
        <View style={styles.webviewHeader}>
          <Button
            label="Отмена"
            variant="secondary"
            onPress={() => setShowWebView(false)}
          />
        </View>
        <TelegramLoginWebView
          onAuth={onTelegramAuth}
          onError={(msg) => {
            setShowWebView(false);
            setError(msg);
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🔐</Text>
        <Text style={styles.title}>Вход</Text>
        <Text style={styles.body}>
          Войди через Telegram, чтобы сохранять прогресс открытия города.
        </Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      <View style={styles.footer}>
        <Button
          label="Войти через Telegram"
          loading={busy}
          disabled={!hasBot}
          onPress={() => {
            setError(null);
            setShowWebView(true);
          }}
        />
        {!hasBot ? (
          <Text style={styles.note}>
            Telegram-бот не настроен (EXPO_PUBLIC_TELEGRAM_BOT_USERNAME).
          </Text>
        ) : null}
        {appConfig.allowDevLogin ? (
          <Button
            label="Войти в dev-режиме"
            variant="secondary"
            loading={busy}
            onPress={onDevLogin}
            style={styles.devBtn}
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
  error: {
    color: colors.danger,
    fontSize: 14,
  },
  note: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  footer: {
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  devBtn: {
    marginTop: spacing.sm,
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webviewHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignItems: "flex-start",
  },
});
