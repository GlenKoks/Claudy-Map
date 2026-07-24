import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/Button";
import { colors, spacing } from "../../src/theme";

export default function ConceptScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🌫️</Text>
        <Text style={styles.title}>Город под туманом</Text>
        <Text style={styles.body}>
          Карта Claudy Map спрятана под туманом. Он рассеивается только там, где
          ты <Text style={styles.bold}>реально прошёл ногами</Text> — по GPS, а
          не по кнопке.
        </Text>
        <Text style={styles.body}>
          Гуляй, открывай новые улицы, собирай статистику прогулок и открытый
          процент города.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          label="Начать"
          onPress={() => router.push("/privacy")}
        />
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
    fontSize: 64,
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "700",
  },
  body: {
    color: colors.textMuted,
    fontSize: 17,
    lineHeight: 24,
  },
  bold: {
    color: colors.text,
    fontWeight: "600",
  },
  footer: {
    paddingBottom: spacing.md,
  },
});
