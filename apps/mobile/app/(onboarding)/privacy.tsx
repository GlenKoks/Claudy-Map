import { useState } from "react";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/Button";
import { useOnboardingStore } from "../../src/stores/onboarding";
import { colors, spacing } from "../../src/theme";

export default function PrivacyScreen() {
  const router = useRouter();
  const acceptPrivacy = useOnboardingStore((s) => s.acceptPrivacy);
  const [checked, setChecked] = useState(false);

  const onContinue = () => {
    acceptPrivacy();
    router.push("/permissions");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <Text style={styles.title}>Конфиденциальность</Text>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.body}>
          Claudy Map собирает данные о твоём местоположении, чтобы открывать
          карту по мере прогулок и считать статистику. Это ключевая механика
          приложения.
        </Text>
        <Text style={styles.heading}>Что мы используем</Text>
        <Text style={styles.body}>
          • Геолокацию (в т.ч. в фоне) — для трекинга маршрута и рассеивания
          тумана.{"\n"}• Данные твоего профиля Telegram — для входа и
          идентификации.
        </Text>
        <Text style={styles.heading}>Как храним</Text>
        <Text style={styles.body}>
          Данные привязаны к твоей учётной записи и не передаются третьим лицам
          для рекламы без твоего согласия. Ты можешь удалить аккаунт и данные.
        </Text>
        <Text style={styles.note}>
          Это черновик политики для этапа разработки. Финальная версия будет
          опубликована перед релизом в сторы.
        </Text>
      </ScrollView>

      <Pressable
        style={styles.consentRow}
        onPress={() => setChecked((v) => !v)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
      >
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked ? <Text style={styles.checkmark}>✓</Text> : null}
        </View>
        <Text style={styles.consentText}>
          Я прочитал(а) и принимаю политику конфиденциальности и согласен(на) на
          обработку геоданных, включая фоновую геолокацию.
        </Text>
      </Pressable>

      <View style={styles.footer}>
        <Button label="Принять и продолжить" disabled={!checked} onPress={onContinue} />
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
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "700",
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  heading: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "600",
  },
  body: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  note: {
    color: colors.textMuted,
    fontSize: 13,
    fontStyle: "italic",
  },
  consentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.primaryText,
    fontSize: 15,
    fontWeight: "700",
  },
  consentText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    paddingBottom: spacing.md,
  },
});
