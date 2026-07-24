import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/Button";
import { useAuthStore } from "../../src/stores/auth";
import { colors, spacing } from "../../src/theme";

export default function MainScreen() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🗺️</Text>
        <Text style={styles.title}>Hello Claudy Map</Text>
        <Text style={styles.body}>
          Ты вошёл как{" "}
          <Text style={styles.bold}>{user?.displayName ?? "гость"}</Text> (вход
          в режиме заглушки).
        </Text>
        <Text style={styles.note}>
          Карта и туман появятся на следующих этапах.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button label="Выйти" variant="secondary" onPress={() => void signOut()} />
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
  note: {
    color: colors.textMuted,
    fontSize: 14,
  },
  footer: {
    paddingBottom: spacing.md,
  },
});
